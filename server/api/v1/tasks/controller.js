exports.create = (req, res, next) => {
  res.json({
    message: 'Task created',
  });
};

exports.all = (req, res, next) => {
  res.json({
    message: 'List of tasks',
  });
};

exports.read = (req, res, next) => {
  res.json({
    message: 'Read one task',
  });
};

exports.update = (req, res, next) => {
  res.json({
    message: 'Update one task',
  });
};

exports.delete = (req, res, next) => {
  res.json({
    message: 'Delete one task',
  });
};
