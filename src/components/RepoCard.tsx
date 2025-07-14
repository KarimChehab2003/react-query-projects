import { FaEye, FaStar } from "react-icons/fa";
import type { Repo } from "../types/GitHubUserExplorerTypes";


function RepoCard(repo:Repo) {
    return (
        <article className="bg-white p-6 shadow-md rounded-lg space-y-2 flex flex-col justify-between" key={repo.id}>
        <section className="flex flex-col space-y-2">
            <a className="text-2xl font-semibold text-[#264653] hover:text-[#2A9D8F] transition-colors duration-200" href={repo.html_url} target="_blank">{repo.name}</a>
            <p className="mb-4">{repo.description || "No Description Available"}</p>
        </section>
        <section className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <p className="flex items-center">
                        <FaEye className="me-2" /> {repo.watchers_count}
                    </p>
                    <p className="flex items-center">
                        <FaStar className="me-2" /> {repo.stargazers_count}
                    </p>
                </div>
                <p>Updated {new Date(repo.updated_at).toLocaleDateString()}</p>
            </div>
            <hr />
            {repo.language && <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-[#2A9D8F] rounded-full"></div>
                <p>{repo.language}</p>
            </div>}
        </section>
    </article>
    );
}

export default RepoCard;