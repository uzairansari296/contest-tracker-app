import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from "./components/Navbar";
import ContestList from "./components/ContestList";
import AdminPanel from './components/AdminPanel';
import BookmarkedContests from './components/BookmarkedContests';
import "./styles/App.css";

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="container">
                        <Routes>
                            <Route path="/" element={<ContestList />} />
                            <Route path="/bookmarks" element={<BookmarkedContests />} />
                            <Route path="/admin" element={<AdminPanel />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
