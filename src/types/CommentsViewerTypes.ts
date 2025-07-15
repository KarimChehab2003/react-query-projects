export interface Post {
    id: number;
    title: string;
    body: string;
}

export interface Comment {
    postId: number;
    id: number;
    email: string;
    body: string
}