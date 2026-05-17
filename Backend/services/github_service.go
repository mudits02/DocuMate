package services

import (
	"documate/DTO"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path"
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
	root := newTreeNodeDraft("", "", "directory", "", 0)
	nodeByPath := map[string]*treeNodeDraft{"": root}

	var ensureDir func(string) *treeNodeDraft
	ensureDir = func(dirPath string) *treeNodeDraft {
		if node, ok := nodeByPath[dirPath]; ok {
			return node
		}

		node := newTreeNodeDraft(dirPath, path.Base(dirPath), "directory", "", 0)
		nodeByPath[dirPath] = node

		parentPath := path.Dir(dirPath)
		if parentPath == "." {
			parentPath = ""
		}

		parent := ensureDir(parentPath)
		parent.children = append(parent.children, node)

		return node
	}

	for _, entry := range entries {
		if entry.Path == "" {
			continue
		}

		parentPath := path.Dir(entry.Path)
		if parentPath == "." {
			parentPath = ""
		}

		parent := ensureDir(parentPath)
		nodeType := "directory"
		if entry.Type == "blob" {
			nodeType = "file"
		}

		if node, exists := nodeByPath[entry.Path]; exists {
			node.Type = nodeType
			node.SHA = entry.SHA
			node.Size = fmt.Sprintf("%d", entry.Size)
			continue
		}

		node := newTreeNodeDraft(entry.Path, path.Base(entry.Path), nodeType, entry.SHA, entry.Size)
		nodeByPath[entry.Path] = node
		parent.children = append(parent.children, node)
	}

	return treeDraftsToDTO(root.children)
}

type treeNodeDraft struct {
	ID       string
	Name     string
	Path     string
	Type     string
	SHA      string
	Size     string
	children []*treeNodeDraft
}

func newTreeNodeDraft(id, name, nodeType, sha string, size int) *treeNodeDraft {
	return &treeNodeDraft{
		ID:       id,
		Name:     name,
		Path:     id,
		Type:     nodeType,
		SHA:      sha,
		Size:     fmt.Sprintf("%d", size),
		children: []*treeNodeDraft{},
	}
}

func treeDraftsToDTO(nodes []*treeNodeDraft) []dto.TreeNode {
	sort.Slice(nodes, func(left, right int) bool {
		if nodes[left].Type != nodes[right].Type {
			return nodes[left].Type == "directory"
		}
		return strings.ToLower(nodes[left].Name) < strings.ToLower(nodes[right].Name)
	})

	result := make([]dto.TreeNode, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, dto.TreeNode{
			ID:       node.ID,
			Name:     node.Name,
			Path:     node.Path,
			Type:     node.Type,
			SHA:      node.SHA,
			Size:     node.Size,
			Children: treeDraftsToDTO(node.children),
		})
	}

	return result
}
