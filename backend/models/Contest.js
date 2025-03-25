import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    platform: { 
        type: String, 
        required: true,
        enum: ['Codeforces', 'CodeChef', 'LeetCode']
    },
    date: { 
        type: Date, 
        required: true 
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    url: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        required: true
    },
    bookmarked: {
        type: Boolean,
        default: false
    },
    solutionLink: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
contestSchema.index({ platform: 1, date: 1 });
contestSchema.index({ status: 1 });
contestSchema.index({ bookmarked: 1 });

export default mongoose.model("Contest", contestSchema);