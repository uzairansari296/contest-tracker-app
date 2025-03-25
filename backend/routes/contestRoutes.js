//Modify the POST route to emit an event when a new contest is added.
import express from "express";
import Contest from "../models/Contest.js";

const router = express.Router();

// Get all contests with filtering and sorting
router.get("/", async (req, res) => {
    try {
        const { platform, status, bookmarked, sort = 'date' } = req.query;
        
        // Build filter object
        const filter = {};
        if (platform) filter.platform = platform;
        if (status) filter.status = status;
        if (bookmarked) filter.bookmarked = bookmarked === 'true';

        // Get current date
        const now = new Date();

        // Update contest statuses
        await Contest.updateMany(
            { date: { $lt: now }, status: 'Upcoming' },
            { $set: { status: 'Completed' } }
        );

        // Get contests with filters and sorting
        const contests = await Contest.find(filter)
            .sort({ [sort]: sort === 'date' ? 1 : -1 })
            .lean();

        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get contest by ID
router.get("/:id", async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        res.json(contest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle bookmark status
router.patch("/bookmark/:id", async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        contest.bookmarked = !contest.bookmarked;
        await contest.save();

        // Emit socket event for real-time updates
        req.app.get('io').emit('contestUpdated', contest);

        res.json(contest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
