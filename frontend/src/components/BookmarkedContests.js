import React, { useState, useEffect } from 'react';
import { fetchContests } from '../services/api';
import ContestCard from './ContestCard';
import '../styles/ContestList.css';

const BookmarkedContests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookmarkedContests = async () => {
            try {
                const allContests = await fetchContests();
                const bookmarked = allContests.filter(contest => contest.bookmarked);
                setContests(bookmarked);
            } catch (error) {
                console.error('Error loading bookmarked contests:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBookmarkedContests();
    }, []);

    if (loading) return <div className="loading">Loading bookmarked contests...</div>;

    return (
        <div className="contest-list">
            <h2>Bookmarked Contests</h2>
            {contests.length === 0 ? (
                <p className="no-contests">No bookmarked contests found</p>
            ) : (
                <div className="contests-grid">
                    {contests.map(contest => (
                        <ContestCard 
                            key={contest._id}
                            contest={contest}
                            onBookmark={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookmarkedContests; 