package services

import (
	"documate/dto"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strings"
)

type githubTreeEntry struct {
	Path string `json:"path"`
	Mode string `json:"mode"`
	Type string `json:"type"`
	SHA  string `json:"sha"`
	Size int    `json:"size"`
	URL  string `json:"url"`
}

type githubTreeResponse struct {
	SHA       string            `json:"sha"`
	Tree      []githubTreeEntry `json:"tree"`
	Truncated bool              `json:"truncated"`
}

type githubBlobResponse struct {
	Name     string `json:"name"`
	Path     string `json:"path"`
	SHA      string `json:"sha"`
	Content  string `json:"content"`
	Encoding string `json:"encoding"`
}

func GetRepoTreeForUser(userID uint, owner, repo, ref string) ([]dto.TreeNode, bool, error) {
	user, err := GetUserByID(userID)
	if err != nil {
		return nil, false, err
	}

	if strings.TrimSpace(user.GitHubAccessToken) == "" {
		return nil, false, fmt.Errorf("github account is not connected")
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/git/trees/%s?recursive=1", owner, repo, ref)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, false, err
	}

	req.Header.Set("Authorization", "Bearer "+user.GitHubAccessToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, false, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, false, fmt.Errorf("github tree request failed: %s", string(body))
	}

	var treeResp githubTreeResponse
	if err := json.Unmarshal(body, &treeResp); err != nil {
		return nil, false, err
	}

	nodes := buildNestedTree(treeResp.Tree)
	return nodes, treeResp.Truncated, nil
}

func GetRepoFileContentForUser(userID uint, owner, repo, ref, filePath string) (*dto.FileContentResponse, error) {
	user, err := GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s?ref=%s", owner, repo, filePath, ref)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+user.GitHubAccessToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("github file request failed: %s", string(body))
	}

	var blob githubBlobResponse
	if err := json.Unmarshal(body, &blob); err != nil {
		return nil, err
	}

	decoded, err := base64.StdEncoding.DecodeString(strings.ReplaceAll(blob.Content, "\n", ""))
	if err != nil {
		return nil, err
	}

	return &dto.FileContentResponse{
		Path:     blob.Path,
		Name:     blob.Name,
		Content:  string(decoded),
		Encoding: "utf-8",
		SHA:      blob.SHA,
	}, nil
}

func buildNestedTree(entries []githubTreeEntry) []dto.TreeNode {
	root := map[string]*dto.TreeNode{}

	for _, entry := range entries {
		if entry.Path == "" {
			continue
		}

		parts := strings.Split(entry.Path, "/")
		current := root
		currentPath := ""

		for index, part := range parts {
			if currentPath == "" {
				currentPath = part
			} else {
				currentPath = currentPath + "/" + part
			}

			node, exists := current[currentPath]
			if !exists {
				nodeType := "directory"
				if index == len(parts)-1 && entry.Type == "blob" {
					nodeType = "file"
				}

				node = &dto.TreeNode{
					ID:   currentPath,
					Name: part,
					Path: currentPath,
					Type: nodeType,
				}
				current[currentPath] = node
			}

			if index == len(parts)-1 {
				node.SHA = entry.SHA
				node.Size = fmt.Sprintf("%d", entry.Size)
				switch entry.Type {
				case "blob":
					node.Type = "file"
				case "tree":
					node.Type = "directory"
				}
			}

			if node.Children == nil {
				node.Children = []dto.TreeNode{}
			}

			childMap := map[string]*dto.TreeNode{}
			for childIndex := range node.Children {
				child := &node.Children[childIndex]
				childMap[child.Path] = child
			}
			current = childMap
		}
	}

	return flattenAndSort(root)
}

func flattenAndSort(nodeMap map[string]*dto.TreeNode) []dto.TreeNode {
	nodes := make([]dto.TreeNode, 0, len(nodeMap))

	for _, node := range nodeMap {
		if len(node.Children) > 0 {
			childMap := map[string]*dto.TreeNode{}
			for childIndex := range node.Children {
				child := &node.Children[childIndex]
				childMap[child.Path] = child
			}
			node.Children = flattenAndSort(childMap)
		}
		nodes = append(nodes, *node)
	}

	sort.Slice(nodes, func(i, j int) bool {
		if nodes[i].Type != nodes[j].Type {
			return nodes[i].Type == "directory"
		}
		return strings.ToLower(nodes[i].Name) < strings.ToLower(nodes[j].Name)
	})

	return nodes
}
