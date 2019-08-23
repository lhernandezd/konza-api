const HTTP_STATUS = require('http-status-codes');

const { Model, fields } = require('./model');
const { paginationParseParams } = require('../../../utils');
const { sortParseParams, sortCompactToStr } = require('../../../utils');

const { signToken } = require('./../auth');

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

exports.signup = async (req, res, next) => {
  const { body = {} } = req;

  try {
    const doc = await Model.create(body);
    const { id } = doc;
    const token = signToken({ id });
    res.status(HTTP_STATUS.CREATED);
    res.json({
      data: doc,
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      meta: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const { body = {} } = req;
  const { email = '', password = '' } = body;
  try {
    const user = await Model.findOne({ email });
    const verified = user && (await user.verifyPassword(password));
    if (user && verified) {
      const { id } = user;
      const token = signToken({ id });
      res.json({
        data: user,
        success: true,
        statusCode: HTTP_STATUS.OK,
        meta: {
          token,
        },
      });
    } else {
      next({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.all = async (req, res, next) => {
  const { query } = req;
  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  const sort = sortCompactToStr(sortBy, direction);

  try {
    const all = Model.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const count = Model.countDocuments();

    const [docs, total] = await Promise.all([all, count]);
    const pages = Math.ceil(total / limit);
    res.json({
      data: docs,
      success: true,
      statusCode: HTTP_STATUS.OK,
      meta: {
        sortBy,
        direction,
        limit,
        skip,
        page,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
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
