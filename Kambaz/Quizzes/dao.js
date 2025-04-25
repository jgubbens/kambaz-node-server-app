import model from './model.js';
import {v4 as uuidv4 } from "uuid";

export function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
}
export function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
}
export function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
}
export function updateQuiz(quizId, quizUpdates) {
    return model.findOneAndUpdate(
        { _id: quizId },
        quizUpdates,
        { new: true, runValidators: true }
      );
}
export function findQuizById(quizId) {
    return model.findById(quizId);
}
export function togglePublish(quizId) {
    return model.findById(quizId).then(quiz => {
        quiz.published = !quiz.published;
        return quiz.save();
    });
}