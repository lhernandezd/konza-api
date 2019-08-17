const router = require('express').Router();

const controller = require('./controller');
const tasksRouter = require('./../tasks/routes');
const { auth, owner } = require('./../auth');

const { sanitizers } = require('./model');

router.param('id', controller.id);

router
  .route('/')
  .get(controller.all)
  .post(auth, sanitizers, controller.create);

router
  .route('/:id')
  .get(controller.read)
  .put(auth, owner, sanitizers, controller.update)
  .delete(controller.delete);

router.use('/:projectId/tasks', tasksRouter);

module.exports = router;
