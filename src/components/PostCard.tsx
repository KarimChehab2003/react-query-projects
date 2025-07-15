import { useState } from "react";
import type { Comment, Post } from "../types/CommentsViewerTypes";
import { useQuery } from "@tanstack/react-query";

function PostCard(post: Post) {
    const [areCommentsShown, toggleComments] = useState<boolean>(false);

    const handleClick = () => {
        toggleComments((prev) => !prev);
    }

    const getComments = async () => {
        const res = await fetch(`http://jsonplaceholder.typicode.com/comments?_limit=50&postId=${post.id}`);
        if (!res.ok) throw new Error("Could not fetch comments");
        const data: Comment[] = await res.json();
        return data;
    }

    const { data: comments, isLoading } = useQuery({
        queryKey: ["comments", post.id],
        queryFn: getComments,
        enabled: areCommentsShown
    })

    return (
        <article key={post.id} className={`${areCommentsShown ? "border-l-4 border-l-indigo-500 bg-indigo-50" : "bg-white"} border-white p-4 hover:-translate-y-0.5 transition-all duration-300 shadow-md rounded-lg my-4 cursor-pointer space-y-4`} onClick={handleClick}>
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 capitalize">{post.title}</h2>
                <p className="text-gray-700">{post.body}</p>
            </div>
            {
                (comments && areCommentsShown || isLoading) && (
                    <>
                        {
                            isLoading && <div className="flex flex-col justify-center items-center">
                                <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-b-transparent animate-spin"></div>
                                <p className="text-gray-500">Loading comments...</p>
                            </div>
                        }
                        {
                            (comments && areCommentsShown) && (
                                <ul className="flex flex-col space-y-2">
                                    {
                                        comments.map((comment) => (
                                            <li key={comment.id} className="bg-gray-50 p-4 shadow-sm rounded-lg ms-4">
                                                <h2 className="text-lg font-semibold text-gray-800">{comment.email}</h2>
                                                <p className="text-gray-700">{comment.body}</p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </>
                )
            }
        </article>
    );
}

export default PostCard;