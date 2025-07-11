import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaExternalLinkAlt, FaUsers } from "react-icons/fa";
import { FaLocationDot, FaSquarePollVertical } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";
import type { User, Repo } from "../types/GitHubUserExplorerTypes";
import RepoCard from "../components/RepoCard";


function GithubUserExplorer() {
    const [inputValue, setInputValue] = useState<string | null>(null);
    const [submittedValue, setSubmittedValue] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue) return null;
        setSubmittedValue(inputValue?.trim());
    }

    const fetchUserProfile = async () => {
        if (!submittedValue) return null;

        const response = await fetch(`https://api.github.com/users/${submittedValue}`, {
            headers: {
                Accept: 'application/vnd.github+json'
            }
        });
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`)
        const data: User = await response.json();
        console.log(data)
        return data;
    }

    const fetchUserRepos = async (login: string) => {
        const response = await fetch(`https://api.github.com/users/${login}/repos?sort=updated&per_page=8`, {
            headers: {
                Accept: 'application/vnd.github+json'
            }
        });
        if (!response.ok) throw new Error(`GitHub Repos API Error: ${response.status}`)
        const data: Repo[] = await response.json();
        console.log("REpos:", data)
        return data;
    }

    const fetchedUser = useQuery({
        queryKey: ["user", submittedValue],
        queryFn: fetchUserProfile,
        enabled: !!submittedValue
    })

    const fetchedUserRepos = useQuery({
        queryKey: ["repos", fetchedUser.data?.login],
        queryFn: () => fetchUserRepos(fetchedUser.data!.login),
        enabled: !!fetchedUser.data?.login
    })

    return (
        <section className="min-h-screen flex flex-col items-center bg-[#F5F7FA] text-[#353535] p-4 lg:p-16 ">
            <div className="max-w-7xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-[#264653]">GitHub User Explorer</h1>
                    <p className="text-xl">Search for GitHub users and explore their repositories</p>
                </div>

                <form className="bg-white rounded-lg shadow-md p-6 flex space-x-2" onSubmit={handleSubmit}>
                    <input className="grow px-3.5 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#F4A261] transition-shadow duration-300" type="text" placeholder="Enter GitHub username..." onChange={handleChange} required />
                    <button className="bg-[#264653] text-white font-medium px-3.5 py-1.5 rounded cursor-pointer" type="submit">Search</button>
                </form>

                {(fetchedUser.isLoading || fetchedUser.isError || fetchedUser.data) && (
                    <article className="flex flex-col lg:flex-row justify-center items-center p-6 bg-white shadow-md space-y-4 lg:space-x-4 rounded-lg">
                        {fetchedUser.isLoading && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-blue-500"></div>
                                <p>Searching for user...</p>
                            </div>
                        )}

                        {fetchedUser.isError && (
                            <div className="flex flex-col items-center justify-center bg-[#E76F51] text-white p-6 space-y-2 rounded-lg w-full">
                                <MdErrorOutline className="text-4xl" />
                                <p>Oops! Something went wrong</p>
                                <p>{fetchedUser.error.message}</p>
                            </div>
                        )}

                        {fetchedUser.data && (
                            <>
                                <figure className="flex flex-col justify-center items-center space-y-2">
                                    <img
                                        className="w-52 rounded-full"
                                        src={fetchedUser.data.avatar_url}
                                        alt={"image of " + fetchedUser.data.name}
                                    />
                                    <a className="bg-[#264653] text-white font-medium px-3.5 py-1.5 rounded cursor-pointer flex items-center" href={fetchedUser.data.html_url} target="_blank"> <FaExternalLinkAlt className="me-2" /> View on GitHub</a>
                                </figure>
                                <section className="space-y-2 flex flex-col">
                                    <p className="text-2xl font-semibold flex flex-col lg:flex-row items-center lg:justify-start">
                                        {fetchedUser.data.name}<span className="text-gray-500 text-base lg:ms-2">@{fetchedUser.data.login}</span>
                                    </p>
                                    <p className="text-center lg:text-start">{fetchedUser.data.bio}</p>
                                    <ul className="flex flex-wrap justify-center lg:justify-start items-center space-x-4">
                                        <li className="flex items-center">
                                            <FaSquarePollVertical className="mr-2" /> {fetchedUser.data.public_repos} repos
                                        </li>
                                        <li className="flex items-center">
                                            <FaLocationDot className="mr-2" /> {fetchedUser.data.location}
                                        </li>
                                        <li className="flex items-center">
                                            <FaUsers className="mr-2" /> {fetchedUser.data.followers} followers
                                        </li>
                                        <li className="flex items-center">
                                            <HiUsers className="mr-2" /> {fetchedUser.data.following} following
                                        </li>
                                    </ul>
                                    {fetchedUser.data.blog && (<a className="text-[#2A9D8F] font-medium text-center lg:text-start" href={fetchedUser.data.blog} target="_blank">{fetchedUser.data.blog}</a>)}
                                </section>
                            </>
                        )}
                    </article>
                )}

                {(fetchedUserRepos.isLoading || fetchedUserRepos.isError || fetchedUserRepos.data) && (
                    <section className="space-y-4">
                        {fetchedUserRepos.isLoading && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-blue-500"></div>
                                <p>Fetching repositories...</p>
                            </div>
                        )}

                        {fetchedUserRepos.isError && (
                            <div className="flex flex-col items-center justify-center bg-[#F4A261] text-[#E76F51] p-6 space-y-2 rounded-lg">
                                <MdErrorOutline className="text-4xl" />
                                <p>Oops! Something went wrong</p>
                                <p>{fetchedUserRepos.error.message}</p>
                            </div>
                        )}
                        {
                            fetchedUserRepos.data && (
                                <>
                                    <h2 className="text-2xl font-semibold">Recent Repositories</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {
                                            fetchedUserRepos.data.map((repo) => (
                                               <RepoCard key={repo.id} {...repo} />
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                    </section>
                )}

            </div>
        </section>
    );
}

export default GithubUserExplorer;