const router = require('express').Router();

const controller = require('./controller');
const tasksRouter = require('./../tasks/routes');
const { auth, owner } = require('./../auth');

const { sanitizers } = require('./model');

router.param('id', controller.id);

router
  .route('/')
  .get(auth, controller.all)
  .post(auth, sanitizers, controller.create);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, owner, sanitizers, controller.update)
  .delete(auth, owner, controller.delete);

router.use('/:projectId/tasks', tasksRouter);

module.exports = router;
