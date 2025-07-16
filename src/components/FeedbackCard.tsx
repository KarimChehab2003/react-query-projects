import { FaThumbsUp } from "react-icons/fa6";
import type { Feedback } from "../types/FeedbackBoardTypes";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function FeedbackCard({ title, id, upvotes, description, category }: Feedback) {
    const [likes, setLikes] = useState<number>(upvotes)
    const queryClient = useQueryClient();
    const getCategoryColor = () => {
        let categoryColor = null;
        switch (category) {
            case "Feature":
                categoryColor = "bg-blue-100 text-blue-800";
                break;
            case "Improvement":
                categoryColor = "bg-green-100 text-green-800";
                break;
            case "Bug":
                categoryColor = "bg-red-100 text-red-800";
                break;
            case "Other":
                categoryColor = "bg-purple-100 text-purple-800";
                break;
        }
        return categoryColor;
    }

    const deleteFeedbackPost = async () => {
        const res = await fetch(`https://68736906c75558e27354208f.mockapi.io/feedbacks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) throw new Error("Could not delete feedback post");
        return res.json();
    }

    const { mutate: removeFeedback } = useMutation({
        mutationKey: ["feedbacks", id],
        mutationFn: deleteFeedbackPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["feedbacks"]
            })
        }
    })

    return (
        <article
            key={id}
            className="p-4 bg-white rounded-lg shadow-md hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer space-y-2"
        >
            <div className="flex justify-between items-center space-y-2">
                <div className="flex flex-col">
                    <h2 className="font-semibold text-xl text-gray-800 capitalize">{title}</h2>
                    <p className="text-gray-600">{description}</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <div className="bg-indigo-500 p-1 rounded-full hover:bg-indigo-600 transition-colors duration-300" onClick={() => setLikes((prev) => prev + 1)}><FaThumbsUp className="text-white text-2xl rounded-full cursor-pointer" /></div>
                    <p className="text-gray-700 font-medium">{likes}</p>
                </div>
            </div>
            <p className={`inline-block px-2.5 py-0.5 ${getCategoryColor()} rounded-full capitalize text-sm font-medium`}>
                {category}
            </p>
            <div className="flex justify-end items-center ">
                <button className="space-x-2 text-gray-500 bg-transparent hover:bg-red-500 px-3.5 py-1.5 transition-colors duration-200 rounded-md cursor-pointer hover:text-white" onClick={() => removeFeedback()}>
                    <FaTrash className="inline-block" /> Delete
                </button>
            </div>
        </article>
    );
}

export default FeedbackCard;