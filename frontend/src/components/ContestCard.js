import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaBookmark, FaRegBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/ContestCard.css';

const ContestCard = ({ contest, onBookmark }) => {
    const getTimeRemaining = () => {
        const now = new Date();
        const contestDate = new Date(contest.date);
        
        if (contest.status === 'Completed') {
            return 'Completed';
        }
        
        if (contest.status === 'Ongoing') {
            return `Ends ${formatDistanceToNow(new Date(contest.endDate))}`;
        }
        
        return `Starts ${formatDistanceToNow(contestDate)}`;
    };

    const getPlatformColor = () => {
        switch(contest.platform) {
            case 'Codeforces': return 'var(--codeforces-color)';
            case 'LeetCode': return 'var(--leetcode-color)';
            case 'CodeChef': return 'var(--codechef-color)';
            default: return 'var(--text-color)';
        }
    };

    return (
        <div className={`contest-card ${contest.status.toLowerCase()}`}>
            <div className="card-header">
                <span className="platform" style={{ color: getPlatformColor() }}>
                    {contest.platform}
                </span>
                <button 
                    className="bookmark-btn"
                    onClick={() => onBookmark(contest._id)}
                    aria-label={contest.bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                    {contest.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
            </div>
            
            <h3 className="contest-name">{contest.name}</h3>
            
            <div className="contest-info">
                <p className="time-remaining">{getTimeRemaining()}</p>
                <p className="duration">Duration: {contest.duration}h</p>
            </div>
            
            <div className="card-actions">
                <a 
                    href={contest.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contest-link"
                >
                    Visit Contest <FaExternalLinkAlt />
                </a>
                {contest.solutionLink && (
                    <a 
                        href={contest.solutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="solution-link"
                    >
                        View Solution <FaExternalLinkAlt />
                    </a>
                )}
            </div>
        </div>
    );
};

export default ContestCard; 