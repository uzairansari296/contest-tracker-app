//Admin Routes
import express from "express";
import Contest from "../models/Contest.js";

const router = express.Router();

// Add solution link manually
router.post("/add-solution", async (req, res) => {
    try {
        const { contestId, solutionLink } = req.body;
        const contest = await Contest.findById(contestId);
        
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        contest.solutionLink = solutionLink;
        await contest.save();

        // Emit socket event for real-time updates
        req.app.get('io').emit('contestUpdated', contest);

        res.json(contest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all completed contests without solutions
router.get("/pending-solutions", async (req, res) => {
    try {
        const contests = await Contest.find({
            status: 'Completed',
            solutionLink: null
        }).sort({ date: -1 });
        
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
