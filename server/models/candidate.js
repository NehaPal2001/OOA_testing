import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    scheduledStartTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    magic_link_token: String,
    isStarted: { type: Boolean, default: false, required: true },
    isCompleted: { type: Boolean, default: false, required: true },
    attemptStatus: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
