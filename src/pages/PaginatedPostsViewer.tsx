import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string
}

function PaginatedPostsViewer() {
    const [page, setPage] = useState<number>(1);

    const getPosts = async () => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`)
            const data: Post[] = await response.json()
            return data;
        } catch (e) {
            console.error(e)
        }
    }

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["posts", page],
        queryFn: getPosts,
        placeholderData: keepPreviousData

    })

    if (isLoading) return <div className="animate-spin rounded-full h-6 w-6 border-4 border-purple-500 border-t-transparent"></div>
    if (isError) return <div>An error occurred... {error.message}</div>

    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-50 to-blue-100 p-16">
            <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-4xl font-bold text-purple-800">Posts Collection</h1>
                    <p className="text-gray-700 text-lg">Browse through our collection of interesting posts</p>
                </div>
                <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 h-[60vh] overflow-auto">
                        {
                            data && (
                                data.map((post) => (
                                    <article key={post.id} className="p-4 border-b border-b-gray-300">
                                        <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                                        <p className="text-gray-700">{post.body}</p>
                                        <p className="text-gray-600">Made by User #{post.userId}</p>
                                    </article>
                                ))
                            )
                        }
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 text-white rounded cursor-pointer font-medium" onClick={() => setPage((page) => page - 1)} disabled={page === 1}>Previous</button>
                        <p>Page {page} of 20</p>
                        <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 text-white rounded cursor-pointer font-medium" onClick={() => setPage((page) => page + 1)} disabled={page === 20}>Next</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PaginatedPostsViewer;