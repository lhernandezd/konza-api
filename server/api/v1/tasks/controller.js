const uuidv4 = require('uuid/v4');
const { generateData, getData, saveData } = require('./functions');

// Create 20 tasks
generateData(20, 'store.json');

exports.create = (req, res, next) => {
  const { body = {} } = req;

  // # Create new task
  // 1. Get tasks from store
  const tasks = getData('store.json');
  // 2. Create system variables
  const _id = uuidv4();
  const created = new Date().toISOString();
  const updated = new Date().toISOString();
  // 3. Create task with the specify body and system values
  const task = {
    ...body, _id, created, updated,
  };
  // 4. Update tasks array
  tasks.push(task);
  // 5. Save tasks in store
  saveData('store.json', tasks);

  res.json({
    message: 'Task successfully created',
    data: task,
  });
};

exports.all = (req, res, next) => {
  const { query = {} } = req;
  const {
    limit = 10, skip = 0, sortBy = 'created', direction = 'desc',
  } = query;

  // # Get all values in tasks array (* with options)
  // 1. Get tasks from store
  const tasks = getData('store.json');
  // 2. Define the order direction value
  const directionOrder = direction === 'desc' ? -1 : 1;
  // 3. Clone tasks array
  const cloneTasks = new Array(...tasks);
  // 4. Sort tasks array (default parameters if the client doesn't specify the query)
  const sortTasks = cloneTasks.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return 1 * directionOrder;
    }
    if (a[sortBy] < b[sortBy]) {
      return -1 * directionOrder;
    }
    return 0;
  });
  // 5. Limit the tasks quantity (defined by the client)
  const limitTasks = sortTasks.slice(Number(skip), Number(skip) + Number(limit));

  res.json({
    message: `All tasks: limit = ${limit}, skip = ${skip}, sortBy = ${sortBy}, direction = ${direction}`,
    data: limitTasks,
  });
};

exports.read = (req, res, next) => {
  const { params = {} } = req;
  const { id = 1 } = params;

  // 1. Get tasks from store
  const tasks = getData('store.json');
  const getTask = tasks.find(task => task._id === id);
  // 2. Declare message
  const message = getTask ? 'Task found' : `The task with id: ${id} doesn't exist`;

  res.json({
    message,
    data: getTask,
  });
};

exports.update = (req, res, next) => {
  const { params = {}, body = {} } = req;
  const { id = 1 } = params;

  // # Start update
  // 1. Get tasks from store
  const tasks = getData('store.json');
  // 2. Create new update date
  const updated = new Date().toISOString();
  // 3. Get the specific task
  const getTask = tasks.find(task => task._id === id);
  // 4. Get the position of the specific task
  const position = tasks.indexOf(getTask);
  // 5. Update the task
  const updatedTask = { ...getTask, ...body, updated };
  // 6. Insert updated task in tasks
  tasks.splice(position, 0, updatedTask);
  // 7. Save tasks in store
  saveData('store.json', tasks);

  res.json({
    message: 'Task successfully updated',
    data: updatedTask,
  });
};

exports.delete = (req, res, next) => {
  const { params = {} } = req;
  const { id = 1 } = params;

  // # Delete task
  // 1. Get tasks from store
  let tasks = getData('store.json');
  // 2. Get the specific task
  const getTask = tasks.find(task => task._id === id);
  /*
  3. Get tasks array filtered
  ( all elements with the exception of the one specified by the client)
  */
  const filterTasks = tasks.filter(task => task._id !== id);
  // 4. Replace previous tasks array with the new one
  tasks = filterTasks;
  // 5. Save tasks in store
  saveData('store.json', tasks);

  res.json({
    message: 'Task successfully deleted',
    data: getTask,
  });
};
