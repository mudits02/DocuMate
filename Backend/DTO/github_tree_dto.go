package dto

type TreeNode struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Path     string     `json:"path"`
	Type     string     `json:"type"`
	SHA      string     `json:"sha"`
	Size     string     `json:"size"`
	Children []TreeNode `json:"children"`
}

type FileContentResponse struct {
	Path     string `json:"path"`
	Name     string `json:"name"`
	Content  string `json:"content"`
	Encoding string `json:"encoding"`
	SHA      string `json:"sha"`
}
