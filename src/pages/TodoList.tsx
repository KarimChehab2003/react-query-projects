import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaClipboardList } from "react-icons/fa6";
import TodoCard from "../components/TodoCard";

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

function TodoList() {
    const [newTodoTitle, setNewTodoTitle] = useState<string>("");
    const queryClient = useQueryClient();
    const baseURL = import.meta.env.VITE_MOCKAPI_BASE_URL;

    const getTodos = async () => {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error(`${response.status}`)
        const data: Todo[] = await response.json();
        return data;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoTitle(event.target.value)
    }

    const addTodo = async (newTodo: Omit<Todo, "id">) => {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        })
        if (!response.ok) throw new Error("Failed to add todo");
        return response.json()
    }

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos
    })

    const { mutate: createTodo, isPending } = useMutation({
        mutationKey: ["todos"],
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos"]
            })
            setNewTodoTitle("");
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTodoTitle) return;
        createTodo({
            title: newTodoTitle,
            completed: false
        })

    }

    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-300 to-pink-500">
            <div className="max-w-3xl w-full p-8 bg-white shadow-md rounded-lg space-y-8">
                {
                    (isLoading || isError || data) && (
                        <>
                            {
                                isLoading && (
                                    <div className="flex items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
                                    </div>
                                )
                            }

                            {
                                isError && (
                                    <div className="flex items-center justify-center bg-red-400 p-4 rounded-lg text-white">
                                        <p className="font-medium">MockAPI error status: {error.message}</p>
                                    </div>
                                )
                            }

                            {
                                data && (
                                    <>
                                        <div className="space-y-1.5">
                                            <h1 className="text-pink-700 font-bold text-4xl">My Todo List</h1>
                                            <p className="text-gray-700">Keep track of your tasks and stay organized</p>
                                        </div>

                                        <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
                                            <input className="grow px-3 py-1.5 border-1 border-gray-300 rounded outline-0 focus:ring-2 focus:ring-pink-700 transition-shadow duration-200" type="text" placeholder="Add a new todo..." value={newTodoTitle} onChange={handleChange} required />
                                            <button className="bg-pink-600 text-white font-medium px-3 py-1.5 rounded cursor-pointer hover:bg-pink-700 transition-colors duration-200 flex items-center" type="submit">Add Task {isPending && (<div className="ml-1 h-4 w-4 animate-spin rounded-full border-4 border-white border-t-transparent"></div>)}</button>
                                        </form>


                                        {data.length !== 0 ? (
                                            <ul>
                                                {
                                                    data.map((todo) => (
                                                        <TodoCard key={todo.id} {...todo} />
                                                    ))
                                                }
                                            </ul>
                                        ) : (
                                            <div className="flex flex-col justify-center items-center space-y-2">
                                                <FaClipboardList className="text-4xl text-pink-700" />
                                                <p className="text-gray-500 text-lg">Your todo list is empty. Add a task to get started!</p>
                                            </div>
                                        )}

                                    </>
                                )
                            }
                        </>
                    )
                }



            </div>
        </section>
    );
}

export default TodoList;