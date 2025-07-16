import { useState } from "react";
import type { Feedback } from "../types/FeedbackBoardTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CgDanger } from "react-icons/cg";
import FeedbackCard from "../components/FeedbackCard";


function FeedbackBoard() {

    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [isFormShown, toggleForm] = useState<boolean>(false);
    const categories: string[] = ["All", "Feature", "Bug", "Improvement", "Other"];
    const [newFeedback, setNewFeedback] = useState<Omit<Feedback, "id">>({
        title: "",
        description: "",
        upvotes: 1,
        category: "Other"
    })

    const queryClient = useQueryClient();

    const handlePickedCategory = (idx: number) => {
        setSelectedCategory(idx);
    }

    const postNewFeedback = async () => {
        const res = await fetch(`https://68736906c75558e27354208f.mockapi.io/feedbacks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newFeedback)
        })
        if (!res.ok) throw new Error("Could not add new feedback");
        return res.json();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewFeedback((prev) => {
            return { ...prev, [name]: value };
        })
    }

    const getFeedbackPosts = async () => {
        const res = await fetch("https://68736906c75558e27354208f.mockapi.io/feedbacks");
        if (!res.ok) throw new Error("Could not fetch feedback posts");
        const data: Feedback[] = await res.json();
        return data;
    }

    const { data: feedbacks, isLoading, isError, error } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: getFeedbackPosts
    })

    const { mutate: createFeedbackPost } = useMutation({
        mutationKey: ["feedbacks"],
        mutationFn: postNewFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["feedbacks"]
            })
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createFeedbackPost()
        toggleForm(false);
    }


    return (
        <main className="min-h-screen flex flex-col items-center bg-[#f0f4f8] p-8 space-y-6 inter">
            <section className="flex justify-between items-center max-w-4xl w-full">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-4xl font-bold text-indigo-900 capitalize">feedback board</h1>
                    <p className="text-gray-600 text-lg font-medium">Share your thoughts and ideas with the team</p>
                </div>
                <button className="bg-indigo-600 px-3.5 py-1.5 rounded-md text-white font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 text-lg" onClick={() => toggleForm((prev) => !prev)}>+ Add Feedback</button>
            </section>

            <section className="flex items-center p-4 space-x-2 max-w-4xl w-full bg-white rounded-lg shadow-md">
                <p className="text-gray-700 font-semibold">Filter by category: </p>
                <ul className="flex flex-wrap items-center space-y-2 space-x-2">
                    {categories.map((category, idx) => (
                        <li className={`${selectedCategory === idx ? "text-indigo-800 bg-indigo-100" : "text-gray-800 bg-gray-100"} rounded-full px-3 py-1 capitalize text-sm cursor-pointer hover:scale-105 transition-all duration-300 font-medium`} key={idx} onClick={() => handlePickedCategory(idx)}>{category}</li>
                    ))}
                </ul>
            </section>

            {
                isFormShown && (
                    <section className="flex flex-col p-4 space-y-2 max-w-4xl w-full bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-900">Add New Feedback</h3>
                        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-1">
                                <label className="text-gray-700 font-medium" htmlFor="titleInput">Title</label>
                                <input className="border border-gray-300 rounded px-3.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200" type="text" id="titleInput" name="title" onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-gray-700 font-medium" htmlFor="descriptionInput">Description</label>
                                <textarea className="border border-gray-300 rounded px-3.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200" id="descriptionInput" name="description" onChange={handleChange} required></textarea>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-gray-700 font-medium" htmlFor="categoryInput">Category</label>
                                <select className="border border-gray-300 rounded px-3.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200" id="categoryInput" name="category" onChange={handleChange} required>
                                    <option value="" hidden>Select Category</option>
                                    {
                                        categories.map((category) => category !== "All" ? (
                                            <option key={category} value={category}>{category}</option>
                                        ) : null)
                                    }
                                </select>
                            </div>

                            <div className="flex justify-end items-center space-x-2">
                                <button className="px-3.5 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-300 cursor-pointer" onClick={() => toggleForm(false)}>Cancel</button>
                                <button className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md transition-all duration-300 text-white cursor-pointer" type="submit">Submit Feedback</button>
                            </div>

                        </form>
                    </section>
                )
            }

            {
                (isLoading || isError || feedbacks) && (
                    <section className="flex flex-col space-y-4 max-w-4xl w-full">
                        {
                            isLoading && (
                                <div className="w-8 h-8 border border-indigo-500 border-b-transparent rounded-full animate-spin"></div>
                            )
                        }
                        {
                            isError && (
                                <div className="flex flex-col justify-center items-center p-4 bg-red-300">
                                    <CgDanger />
                                    <p>An error occurred: {error.message}</p>
                                </div>
                            )
                        }
                        {
                            feedbacks && (
                                (selectedCategory === 0
                                    ? feedbacks
                                    : feedbacks.filter(
                                        (feedback) => feedback.category === categories[selectedCategory]
                                    )
                                ).map((feedback) => (
                                    <FeedbackCard key={feedback.id} {...feedback} />
                                ))
                            )}

                    </section>
                )
            }
        </main>
    );
}

export default FeedbackBoard;