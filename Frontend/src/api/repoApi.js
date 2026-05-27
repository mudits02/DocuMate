import {api} from './api'

export const getTreeRepo = async (owner, repo, ref = "HEAD") => {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/tree`, {
        params: {ref}
    });

    return response.data;
}

export const getFileContent = async (owner, repo, filePath, ref = "HEAD") => {
    const response = await api.get(`api/github/repos/${owner}/${repo}/blob`, {
        params: {ref, path: filePath}
    });

    return response.data;
}
