import * as quizzesDao from "./dao.js";
import quizModel from "./model.js"
import Submission from './submissionSchema.js';
export default function QuizRoutes(app) {
    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quizUpdates = req.body;
        const status = await quizzesDao.updateQuiz(quizId, quizUpdates);
        res.send(status);
    });
    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const status = await quizzesDao.deleteQuiz(quizId);
        res.send(status);
    });
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quiz = { ...req.body, course: courseId };
        const newQuiz = await quizzesDao.createQuiz(quiz);
        res.json(newQuiz);
    });
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
        res.json(quizzes);
    });
    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizzesDao.findQuizById(quizId);
        res.json(quiz);
    });

    app.post('/api/quizzes/:quizId/submit', async (req, res) => {
        const { quizId } = req.params;
        const { studentId, answers } = req.body;
    
        try {
            const quiz = await quizModel.findById(quizId);
            if (!quiz) return res.status(404).send("Quiz not found");
    
            // grading
            let score = 0;
            quiz.questions.forEach((question, idx) => {
                const answer = answers[idx];
                switch (question.type) {
                    case 'multiple-choice':
                    case 'true-false':
                        if (answer === question.correctOption) score += question.points;
                        break;
                    case 'fill-blank':
                        const correct = question.correctAnswer?.trim().toLowerCase();
                        const userInput = (answer || '').trim().toLowerCase();
                        if (correct === userInput) score += question.points;
                        break;
                }
            });
    
            let submission = await Submission.findOne({ quizId, studentId });
    
            if (submission) {
                submission.answers = answers;
                submission.score = score;
                submission.numAttempts = submission.numAttempts ? submission.numAttempts + 1 : 2;
                await submission.save();
                return res.json({ message: 'Submission updated', score, submissionId: submission._id, numAttempts: submission.numAttempts });
            } else {
                submission = await Submission.create({
                    quizId,
                    studentId,
                    answers,
                    score,
                    numAttempts: 1,
                });
                return res.json({ message: 'Submitted', score, submissionId: submission._id, numAttempts: submission.numAttempts });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Failed to submit');
        }
    });

    app.get('/api/quizzes/:quizId/submissions/:studentId', async (req, res) => {
        const { quizId, studentId } = req.params;
        const submission = await Submission.findOne({ quizId, studentId });
        if (!submission) return res.status(404).send("No submission found");
        res.json(submission);
    });

    app.put('/api/quizzes/:quizId/publish', async (req, res) => {
        const { quizId } = req.params;
        const status = await quizzesDao.togglePublish(quizId);
        res.send(status);
    });
}