export interface Feedback {
    id: number;
    title: string;
    description: string;
    category: "Feature" | "Bug" | "Improvement" | "Other";
    upvotes: number
}
