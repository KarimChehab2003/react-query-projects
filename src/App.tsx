import Layout from "./components/Layout";
import GithubUserExplorer from "./pages/GithubUserExplorer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PaginatedPostsViewer from "./pages/PaginatedPostsViewer";
import TodoList from "./pages/TodoList";
import CurrencyConverter from "./pages/CurrencyConverter";
import CommentsViewer from "./pages/CommentsViewer";
import FeedbackBoard from "./pages/FeedbackBoard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<GithubUserExplorer />} />
                    <Route path="post-viewer" element={<PaginatedPostsViewer />} />
                    <Route path="todo-list" element={<TodoList />} />
                    <Route path="currency-converter" element={<CurrencyConverter />} />
                    <Route path="comments-viewer" element={<CommentsViewer />} />
                    <Route path="feedback-board" element={<FeedbackBoard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;