export interface User {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    location: string;
    public_repos: number;
    followers: number;
    following: number;
    blog: string;
    html_url: string
}

export interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    updated_at: string;
    language: string;
    stargazers_count: number;
    watchers_count: number;
}
