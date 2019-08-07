const HTTP_STATUS = require('http-status-codes');

const Model = require('./model');
const { paginationParseParams } = require('./../../../utils');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id);
    if (doc) {
      req.doc = doc;
      next();
    } else {
      next({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Resource not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { body = {} } = req;

  try {
    const doc = await Model.create(body);
    res.status(HTTP_STATUS.CREATED);
    res.json({
      data: doc,
      success: true,
      statusCode: HTTP_STATUS.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

exports.all = (req, res, next) => {
  const { query } = req;
  const { limit, page, skip } = paginationParseParams(query);

  Model.find({})
    .skip(skip)
    .limit(limit)
    .exec((err, docs) => {
      if (err) {
        next(err);
      } else {
        res.json({
          data: docs,
          success: true,
          statusCode: HTTP_STATUS.OK,
          meta: {
            limit,
            skip,
            page,
          },
        });
      }
    });
};

exports.read = (req, res, next) => {
  const { doc = {} } = req;
  res.json({
    data: doc,
    success: true,
    statusCode: HTTP_STATUS.OK,
  });
};

exports.update = async (req, res, next) => {
  const { body = {}, doc = {} } = req;

  try {
    Object.assign(doc, body);
    const updated = await doc.save();

    res.json({
      data: updated,
      success: true,
      statusCode: HTTP_STATUS.OK,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { doc = {} } = req;

  try {
    const deleted = await doc.remove();

    res.json({
      data: deleted,
      success: true,
      statusCode: HTTP_STATUS.OK,
    });
  } catch (error) {
    next(error);
  }
};
