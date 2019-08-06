const Model = require('./model');

exports.id = (req, res, next, id) => {
  Model.findById(id, (err, doc) => {
    if (err) {
      next(err);
    } else if (doc) {
      req.doc = doc;
      next();
    } else {
      next({
        statusCode: 404,
        message: 'Resource not found',
      });
    }
  });
};

exports.create = (req, res, next) => {
  const { body = {} } = req;

  Model.create(body, (err, doc) => {
    if (err) {
      next(err);
    } else {
      res.status(201);
      res.json(doc);
    }
  });
};

exports.all = (req, res, next) => {
  Model.find({}, (err, docs) => {
    if (err) {
      next(err);
    } else {
      res.json(docs);
    }
  });
};

exports.read = (req, res, next) => {
  const { doc = {} } = req;
  res.json(doc);
};

exports.update = (req, res, next) => {
  const { body = {}, doc = {} } = req;
  Object.assign(doc, body);

  doc.save((err, document) => {
    if (err) {
      next(err);
    } else {
      res.json(document);
    }
  });
};

exports.delete = (req, res, next) => {
  const { doc = {} } = req;
  doc.remove((err, document) => {
    if (err) {
      next(err);
    } else {
      res.json(document);
    }
  });
};
