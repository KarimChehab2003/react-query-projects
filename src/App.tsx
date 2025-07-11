import Layout from "./components/Layout";
import GithubUserExplorer from "./pages/GithubUserExplorer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PaginatedPostsViewer from "./pages/PaginatedPostsViewer";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<GithubUserExplorer />} />
                    <Route path="post-viewer" element={<PaginatedPostsViewer />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;