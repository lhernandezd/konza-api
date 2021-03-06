const router = require('express').Router();

const controller = require('./controller');
const tasksRouter = require('./../tasks/routes');
const { auth, me } = require('./../auth');
const { sanitizers } = require('./model');


router.param('id', controller.id);

router.route('/signup').post(sanitizers, controller.signup);
router.route('/signin').post(sanitizers, controller.signin);

router.route('/').get(auth, controller.all);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, me, sanitizers, controller.update)
  .delete(auth, me, controller.delete);

router.use('/:userId/tasks', tasksRouter);

module.exports = router;
