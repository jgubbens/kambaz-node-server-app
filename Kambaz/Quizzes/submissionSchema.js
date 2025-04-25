import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  studentId: { type: String, required: true },
  answers: { type: Object, required: true },
  score: Number,
  submittedAt: { type: Date, default: Date.now }
}, { collection: 'submissions' });

export default mongoose.model('Submission', submissionSchema);