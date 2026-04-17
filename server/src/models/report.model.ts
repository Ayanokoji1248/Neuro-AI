import mongoose, { Schema, model } from "mongoose";

const reportSchema = new Schema({

    // User who created the report (logged-in user)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    // Patient basic info
    patientName: {
        type: String,
        required: true,
        trim: true
    },

    patientAge: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },

    patientGender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    // MRI scan image
    imageUrl: {
        type: String,
        required: true
    },

    overlayUrl: {
        type: String,
        required: false
    },

    maskUrl: {
        type: String,
        required: false
    },

    coloredMaskUrl: {
        type: String,
        required: false
    },

    flairPreviewUrl: {
        type: String,
        required: false
    },

    // AI detection result
    result: {
        type: String,
        enum: ["Tumor", "No Tumor", "Pending"],
        default: "Pending"
    },

    // AI confidence score (example: 97.5%)
    confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },


}, {
    timestamps: true
});

const Report = model("Report", reportSchema);

export default Report;
