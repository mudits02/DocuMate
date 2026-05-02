import { api } from "./api";

export const getGitHubRepos = async () => {
    const response = await api.get("/api/github/repos");
    return response.data.repos;
}