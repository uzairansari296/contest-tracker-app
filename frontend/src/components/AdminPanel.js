import React, { useState, useEffect } from 'react';
import { getPendingSolutions, addSolutionLink } from '../services/api';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContest, setSelectedContest] = useState(null);
    const [solutionLink, setSolutionLink] = useState('');

    useEffect(() => {
        loadPendingContests();
    }, []);

    const loadPendingContests = async () => {
        try {
            const data = await getPendingSolutions();
            setContests(data);
        } catch (error) {
            console.error('Error loading pending contests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedContest || !solutionLink) return;

        try {
            await addSolutionLink(selectedContest._id, solutionLink);
            setContests(contests.filter(c => c._id !== selectedContest._id));
            setSelectedContest(null);
            setSolutionLink('');
        } catch (error) {
            console.error('Error adding solution link:', error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-panel">
            <h2>Add Solution Links</h2>
            <form onSubmit={handleSubmit} className="solution-form">
                <div className="form-group">
                    <label htmlFor="contest">Select Contest:</label>
                    <select
                        id="contest"
                        value={selectedContest?._id || ''}
                        onChange={(e) => setSelectedContest(
                            contests.find(c => c._id === e.target.value)
                        )}
                    >
                        <option value="">Select a contest...</option>
                        {contests.map(contest => (
                            <option key={contest._id} value={contest._id}>
                                {contest.platform} - {contest.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="solution">Solution Link:</label>
                    <input
                        type="url"
                        id="solution"
                        value={solutionLink}
                        onChange={(e) => setSolutionLink(e.target.value)}
                        placeholder="YouTube video URL"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    disabled={!selectedContest || !solutionLink}
                >
                    Add Solution
                </button>
            </form>
        </div>
    );
};

export default AdminPanel; 