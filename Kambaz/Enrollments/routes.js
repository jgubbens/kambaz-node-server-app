import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  app.delete("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    await dao.unenrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  });

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    const { userId } = req.params;
    const enrollments = await dao.findCoursesForUser(userId);
    res.json(enrollments);
  });
}