const express = require('express');
const TeacherController = require('../controllers/teacherController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', TeacherController.getAllTeachers);
router.get('/:id', TeacherController.getTeacherById);
router.post('/', TeacherController.createTeacher);
router.put('/:id', TeacherController.updateTeacher);
router.delete('/:id', TeacherController.deleteTeacher);

module.exports = router;
