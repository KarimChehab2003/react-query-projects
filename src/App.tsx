import Layout from "./components/Layout";
import GithubUserExplorer from "./pages/GithubUserExplorer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<GithubUserExplorer />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;