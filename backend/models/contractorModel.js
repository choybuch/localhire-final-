import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    govId: {
        type: String,
        required: true
    },
    proofDoc: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    about: String,
    address: {
        type: Object,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true // Set default availability to true for new contractors
    }
});

export default mongoose.model("contractor", contractorSchema);