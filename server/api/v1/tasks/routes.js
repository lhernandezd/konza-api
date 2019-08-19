const router = require('express').Router({
  mergeParams: true,
});

const controller = require('./controller');
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

module.exports = router;
