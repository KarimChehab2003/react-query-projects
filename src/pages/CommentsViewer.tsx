import { useQuery } from "@tanstack/react-query";
import type { Post } from "../types/CommentsViewerTypes";
import PostCard from "../components/PostCard";

function CommentsViewer() {

    const getPosts = async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
        if (!res.ok) throw new Error("Could not fetch posts");
        const data: Post[] = await res.json();
        return data;
    }

    const { data: posts, isError, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts
    })

    return (
        <section className="min-h-screen flex justify-center items-center bg-[#f0f4f8]">
            {
                (isLoading || isError || posts) && (
                    <div className="max-w-4xl w-full flex flex-col items-center p-8">
                        {isLoading && (
                            <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-b-transparent animate-spin"></div>
                        )}

                        {
                            isError && (
                                <div>An error has occurred: {error.message}</div>
                            )
                        }

                        {posts && (
                            <>
                                <h1 className="text-4xl text-indigo-800 font-bold mb-2 capitalize">community discussions</h1>
                                <p className="text-lg text-gray-600 font-medium mb-4">Select a post to view comments</p>
                                <div className="grid-cols-1">
                                    {
                                        posts.map((post) => (
                                            <PostCard key={post.id} {...post} />
                                        ))
                                    }
                                </div>
                            </>
                        )
                        }
                    </div>
                )
            }
        </section>
    );
}

export default CommentsViewer;