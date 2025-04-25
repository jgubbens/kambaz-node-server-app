import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-blank'], required: true },
    title: { type: String, required: true },
    options: [String],
    correctOption: Number,
    correctAnswer: mongoose.Schema.Types.Mixed,
    points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
        _id: String,
        // editable and persist, functionality not required
        type: {
            type: String,
            enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
            default: "Graded Quiz",
        },
        assignmentGroup: {
            type: String,
            enum: ["Quizzes", "Exams", "Assignments", "Project"],
            default: "Quizzes",
        },
        shuffleAnswers: Boolean,
        timeLimit: Number,
        timeLimitEnabled: Boolean,
        lockQuestionsAfterAnswering: Boolean,
        showCorrectAnswersImm: Boolean,
        dateShowAnswers: Date, // if showCorrectAnswersImm is false
        accessCode: Number,
        oneQuestionAtATime: Boolean,
        webcamRequired: Boolean,
        dueDate: Date,
        // must be implemented
        multipleAttempts: Boolean,
        numAttempts: Number, // if multipleAttempts is true, default is 1 otherwise
        points: Number, // sum of points of all questions
        title: String,
        course: String,
        description: String,
        availableFrom: Date,
        availableUntil: Date,
        questions: [questionSchema],
        published: Boolean,
    },
    { collection: "quizzes" }
);
export default quizSchema;