import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../types/TodoListTypes";

function TodoCard({ id, title, completed }: Todo) {
    const [isCompleted, toggleCompleted] = useState<boolean>(completed);
    const queryClient = useQueryClient();
    const baseURL = import.meta.env.VITE_MOCKAPI_BASE_URL;
    const updateTodo = async (newCompleted: boolean) => {
        const res = await fetch(`${baseURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                completed: newCompleted
            })
        })
        if (!res.ok) throw new Error("Error updating todo state");
        return res.json();
    }

    const deleteTodo = async () => {
        const res = await fetch(`${baseURL}/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Error occurred while deleting todo");
        return res.json();
    }

    const { mutate: toggleCompletionState } = useMutation({
        mutationKey: ["todos", id],
        mutationFn: updateTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        }
    });

    const { mutate: removeTodo } = useMutation({
        mutationKey: ["todos", id],
        mutationFn: deleteTodo,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["todos"] }) }
    })


    return (
        <article className="flex justify-between items-center border border-gray-300 rounded-lg p-4 my-2">
            <div className="flex items-center space-x-2">
                <input className="accent-pink-800 cursor-pointer" type="checkbox" checked={isCompleted} onChange={() => {
                    const newState = !isCompleted;
                    toggleCompleted(newState);
                    toggleCompletionState(newState)
                }} />
                <p className={isCompleted ? "line-through text-gray-400" : ""}>{title}</p>
            </div>
            <FaTrash className="text-rose-600 hover:text-rose-700 transition-colors duration-200 cursor-pointer" onClick={() => removeTodo()} />
        </article>
    );
}

export default TodoCard;