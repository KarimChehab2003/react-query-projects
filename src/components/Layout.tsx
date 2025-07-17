import { NavLink, Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-[#264653] text-white p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <nav className="space-y-2">
                    <NavLink to="/" end className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>GitHub User Explorer  (useQuery & dependent Queries)</NavLink>
                    <NavLink to={"/post-viewer"} className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>Paginated Posts Viewer  (Pagination)</NavLink>
                    <NavLink to={"/todo-list"} className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>TodoList w/ Add & Delete  (useMutation)</NavLink>
                    <NavLink to={"/currency-converter"} className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>Currency Converter  (useQuery & useMutation)</NavLink>
                    <NavLink to={"/comments-viewer"} className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>Comments Viewer  (dependent Queries)</NavLink>
                    <NavLink to={"/feedback-board"} className={({ isActive }) => isActive
                        ? "block px-4 py-2 bg-[#2A9D8F] rounded transition-colors duration-200"
                        : "block px-4 py-2 hover:bg-[#2A9D8F]/60 rounded"}>Feedback Board (useQuery & useMutation)</NavLink>
                </nav>
            </aside>

            <main className="flex-1 select-none">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;