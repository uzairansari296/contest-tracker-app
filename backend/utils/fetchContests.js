//Fetch Contests from APIs
import axios from "axios";
import Contest from "../models/Contest.js";

const PLATFORMS = {
    CODEFORCES: {
        name: "Codeforces",
        url: "https://codeforces.com/api/contest.list",
        transform: (data) => data.result.map(c => ({
            name: c.name,
            platform: "Codeforces",
            date: new Date(c.startTimeSeconds * 1000),
            endDate: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
            duration: c.durationSeconds / 3600,
            url: `https://codeforces.com/contest/${c.id}`,
            status: c.phase === 'BEFORE' ? 'Upcoming' : 
                   c.phase === 'CODING' ? 'Ongoing' : 'Completed'
        }))
    },
    CODECHEF: {
        name: "CodeChef",
        url: "https://www.codechef.com/api/list/contests/all",
        transform: (data) => {
            const allContests = [...(data.future_contests || []), ...(data.present_contests || [])];
            return allContests.map(c => ({
                name: c.contest_name,
                platform: "CodeChef",
                date: new Date(c.contest_start_date_iso || c.contest_start_date),
                endDate: new Date(c.contest_end_date_iso || c.contest_end_date),
                duration: (new Date(c.contest_end_date_iso || c.contest_end_date) - 
                         new Date(c.contest_start_date_iso || c.contest_start_date)) / (1000 * 3600),
                url: `https://www.codechef.com/${c.contest_code}`,
                status: new Date() < new Date(c.contest_start_date_iso || c.contest_start_date) ? 'Upcoming' : 
                       new Date() < new Date(c.contest_end_date_iso || c.contest_end_date) ? 'Ongoing' : 'Completed'
            }));
        }
    }
};

// Generate LeetCode contests
const generateLeetCodeContests = () => {
    const now = new Date();
    const upcomingContests = [];
    
    // Find the next Saturday for Weekly Contest
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
    nextSaturday.setHours(2, 30, 0, 0); // 2:30 AM IST

    // Find the next Sunday for Biweekly Contest
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + ((0 - now.getDay() + 7) % 7));
    nextSunday.setHours(2, 30, 0, 0); // 2:30 AM IST

    // Generate next 4 weekly contests
    for (let i = 0; i < 4; i++) {
        const contestDate = new Date(nextSaturday);
        contestDate.setDate(contestDate.getDate() + (i * 7));
        
        upcomingContests.push({
            name: `Weekly Contest ${Math.floor(390 + i)}`, // Update this number based on current contest
            platform: "LeetCode",
            date: new Date(contestDate),
            endDate: new Date(contestDate.getTime() + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
            duration: 1.5,
            url: `https://leetcode.com/contest/weekly-contest-${390 + i}`,
            status: 'Upcoming'
        });
    }

    // Generate next 2 biweekly contests
    for (let i = 0; i < 2; i++) {
        const contestDate = new Date(nextSunday);
        contestDate.setDate(contestDate.getDate() + (i * 14)); // Every other Sunday
        
        upcomingContests.push({
            name: `Biweekly Contest ${Math.floor(125 + i)}`, // Update this number based on current contest
            platform: "LeetCode",
            date: new Date(contestDate),
            endDate: new Date(contestDate.getTime() + 1.5 * 60 * 60 * 1000),
            duration: 1.5,
            url: `https://leetcode.com/contest/biweekly-contest-${125 + i}`,
            status: 'Upcoming'
        });
    }

    return upcomingContests;
};

export const fetchContests = async () => {
    try {
        // First, fetch from regular APIs
        for (const platform of Object.values(PLATFORMS)) {
            try {
                const response = await axios.get(platform.url);
                const contests = platform.transform(response.data);

                for (const contest of contests) {
                    await Contest.findOneAndUpdate(
                        { 
                            name: contest.name, 
                            platform: contest.platform 
                        },
                        contest,
                        { upsert: true, new: true }
                    );
                }
                console.log(`✅ Successfully fetched ${platform.name} contests`);
            } catch (error) {
                console.error(`❌ Error fetching ${platform.name} contests:`, error.message);
            }
        }

        // Then handle LeetCode contests separately
        const leetcodeContests = generateLeetCodeContests();
        for (const contest of leetcodeContests) {
            await Contest.findOneAndUpdate(
                { 
                    name: contest.name, 
                    platform: contest.platform 
                },
                contest,
                { upsert: true, new: true }
            );
        }
        console.log('✅ Successfully generated LeetCode contests');

    } catch (error) {
        console.error("❌ Error in fetchContests:", error.message);
    }
};

// Initial fetch when the server starts
fetchContests();

// Schedule periodic updates every 30 minutes
setInterval(fetchContests, 30 * 60 * 1000);
