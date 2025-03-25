//Update ContestList.js to listen for real-time updates:

import React, { useEffect, useState } from "react";
import { fetchContests, bookmarkContest } from "../services/api";
import socket from "../services/socket";
import Filter from "./Filter";
import "../styles/ContestList.css";
import "../styles/Loading.css";
import { useTheme } from '../contexts/ThemeContext';
import ContestCard from './ContestCard';

const ContestList = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        platforms: [],
        status: 'all'
    });
    const { darkMode } = useTheme();

    useEffect(() => {
        const loadContests = async () => {
            try {
                const data = await fetchContests();
                setContests(data);
            } catch (err) {
                console.error('Error loading contests:', err);
            } finally {
                setLoading(false);
            }
        };

        loadContests();
        
        socket.on("newContest", (newContest) => {
            setContests((prev) => [newContest, ...prev]);
        });

        return () => socket.off("newContest");
    }, []);

    const handleBookmark = async (contestId) => {
        try {
            await bookmarkContest(contestId);
            setContests(contests.map(contest => 
                contest._id === contestId 
                    ? { ...contest, bookmarked: !contest.bookmarked }
                    : contest
            ));
        } catch (error) {
            console.error('Error bookmarking contest:', error);
        }
    };

    const filteredContests = contests.filter(contest => {
        const platformMatch = filters.platforms.length === 0 || 
                            filters.platforms.includes(contest.platform);
        const statusMatch = filters.status === 'all' || 
                          contest.status === filters.status;
        return platformMatch && statusMatch;
    });

    if (loading) return <div className="loading">Loading contests...</div>;

    return (
        <div className={`contest-list ${darkMode ? 'dark' : ''}`}>
            <Filter filters={filters} setFilters={setFilters} />
            <div className="contests-grid">
                {filteredContests.map(contest => (
                    <ContestCard 
                        key={contest._id}
                        contest={contest}
                        onBookmark={handleBookmark}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContestList;
