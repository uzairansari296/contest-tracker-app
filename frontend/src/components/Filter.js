import React from "react";
import "../styles/Filter.css";

const Filter = ({ filters, setFilters }) => {
    const platforms = ['Codeforces', 'LeetCode', 'CodeChef'];
    const statuses = ['all', 'Upcoming', 'Ongoing', 'Completed'];

    const handlePlatformChange = (platform) => {
        setFilters(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform]
        }));
    };

    return (
        <div className="filter-container">
            <div className="platform-filters">
                {platforms.map(platform => (
                    <label key={platform} className="platform-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.platforms.includes(platform)}
                            onChange={() => handlePlatformChange(platform)}
                        />
                        {platform}
                    </label>
                ))}
            </div>

            <div className="status-filter">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        status: e.target.value
                    }))}
                >
                    {statuses.map(status => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Filter;
