import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  app.delete("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    dao.unenrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  });

  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });
}