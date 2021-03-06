const HTTP_STATUS = require('http-status-codes');

const { Model, fields, references } = require('./model');
const { paginationParseParams } = require('./../../../utils');
const { sortParseParams, sortCompactToStr } = require('./../../../utils');
const { filterByNested } = require('./../../../utils');

const referencesNames = Object.getOwnPropertyNames(references);

exports.id = async (req, res, next, id) => {
  try {
    const populate = referencesNames.join(' ');
    const doc = await Model.findById(id).populate(populate).exec();
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
  const { body = {}, params = {} } = req;

  try {
    const doc = await Model.create({ ...body, ...params });
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

exports.all = async (req, res, next) => {
  const { query = {}, params = {} } = req;
  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  const sort = sortCompactToStr(sortBy, direction);
  const {
    filters,
    populate,
  } = filterByNested(params, referencesNames);

  try {
    const all = Model.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
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
  const { body = {}, doc = {}, params = {} } = req;

  try {
    Object.assign(doc, body, params);
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
