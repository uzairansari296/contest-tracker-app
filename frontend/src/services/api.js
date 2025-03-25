import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const fetchContests = async () => {
    try {
        const { data } = await api.get('/contests');
        return data;
    } catch (error) {
        console.error('Error fetching contests:', error);
        throw error;
    }
};

export const bookmarkContest = async (contestId) => {
    try {
        const { data } = await api.patch(`/contests/bookmark/${contestId}`);
        return data;
    } catch (error) {
        console.error('Error bookmarking contest:', error);
        throw error;
    }
};

export const getPendingSolutions = async () => {
    try {
        const { data } = await api.get('/admin/pending-solutions');
        return data;
    } catch (error) {
        console.error('Error fetching pending solutions:', error);
        throw error;
    }
};

export const addSolutionLink = async (contestId, solutionLink) => {
    try {
        const { data } = await api.post('/admin/add-solution', {
            contestId,
            solutionLink
        });
        return data;
    } catch (error) {
        console.error('Error adding solution link:', error);
        throw error;
    }
};
