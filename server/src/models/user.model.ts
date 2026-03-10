import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "doctor", "radiologist", "patient"],
        default: "patient"
    },
    report: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "report"
    }]
}, {
    timestamps: true
})

const User = model("user", userSchema);

export default User;