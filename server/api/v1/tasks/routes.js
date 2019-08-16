const router = require('express').Router({
  mergeParams: true,
});

const controller = require('./controller');
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

module.exports = router;
