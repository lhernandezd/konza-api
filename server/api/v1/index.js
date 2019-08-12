const router = require('express').Router();

const tasks = require('./tasks/routes');
const projects = require('./projects/routes');
const users = require('./users/routes');

router.use('/tasks', tasks);
router.use('/projects', projects);
router.use('/users', users);

module.exports = router;
