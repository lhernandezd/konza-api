const router = require('express').Router();

const controller = require('./controller');
const tasksRouter = require('./../tasks/routes');
const { auth, me } = require('./../auth');
const { sanitizers } = require('./model');


router.param('id', controller.id);

router.route('/signup').post(sanitizers, controller.signup);
router.route('/signin').post(controller.signin);

router.route('/').get(controller.all);

router
  .route('/:id')
  .get(controller.read)
  .put(auth, me, sanitizers, controller.update)
  .delete(controller.delete);

router.use('/:userId/tasks', tasksRouter);

module.exports = router;
