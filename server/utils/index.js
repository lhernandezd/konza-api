const config = require('./../config');

const { pagination, sort, populate } = config;

const paginationParseParams = ({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip,
}) => ({
  limit: parseInt(limit, 10),
  page: parseInt(page, 10),
  skip: skip ? parseInt(skip, 10) : (page - 1) * limit,
});

const sortParseParams = (
  { sortBy = sort.sortBy.default, direction = sort.direction.default },
  fields,
) => {
  const whitelist = {
    sortBy: [...Object.getOwnPropertyNames(fields), ...sort.sortBy.fields],
    direction: sort.direction.options,
  };

  return {
    sortBy: whitelist.sortBy.includes(sortBy) ? sortBy : sort.sortBy.default,
    direction: whitelist.direction.includes(direction) ? direction : sort.direction.default,
  };
};

const sortCompactToStr = (sortBy, direction) => {
  const dir = direction === 'desc' ? '-' : '';
  return `${dir}${sortBy}`;
};

const filterByNested = (params, referencesNames) => {
  const paramsNames = Object.getOwnPropertyNames(params);
  const populateNames = referencesNames.filter(item => !paramsNames.includes(item));
  return {
    filters: params,
    populate: populateNames.join(' '),
  };
};

const populateToObject = (populateNames, virtuals = {}) => {
  const virtualNames = Object.getOwnPropertyNames(virtuals);
  const { virtuals: virtualConfig } = populate;
  return populateNames.map((item) => {
    let options = {};
    if (virtualNames.includes(item)) {
      options = {
        limit: virtualConfig.limit,
        sort: sortCompactToStr(virtualConfig.sort, virtualConfig.direction),
      };
    }
    return {
      path: item,
      options,
    };
  });
};

module.exports = {
  paginationParseParams,
  sortParseParams,
  sortCompactToStr,
  filterByNested,
  populateToObject,
};
