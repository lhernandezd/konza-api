const fs = require("fs");
const uuidv4 = require('uuid/v4');

const generateData = function(number, filename) {
  const tasks = getData(filename);
  if (tasks.length < 1) {
    for(let i = 1; i<=number; i++) {
      let randomDate = new Date(+(new Date()) - Math.floor(Math.random()*10000000000));
      tasks.push({
        title: `Prueba ${i}`,
        description: i*i,
        _id: uuidv4(),
        created: randomDate.toISOString(),
        updated: randomDate.toISOString(),
      });
    };
    saveData(filename, tasks);
  }
};

const getData = function(filename) {
  let content;
  try {
    const data = fs.readFileSync(filename);
    content = JSON.parse(data);
  } catch {
    content = [];
  }
  return content;
};

const saveData = function(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 2), "utf-8");
};

module.exports = {
  generateData,
  getData,
  saveData,
};
