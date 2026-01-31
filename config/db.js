const fs = require('fs');
const path = require('path');

// 定义数据文件路径
const usersFile = path.join(__dirname, '../data/users.json');
const settingsFile = path.join(__dirname, '../data/settings.json');

// 确保数据目录存在
const ensureDataDir = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 初始化数据文件
const initFiles = () => {
  ensureDataDir();
  
  // 初始化用户文件
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
  }
  
  // 初始化设置文件
  if (!fs.existsSync(settingsFile)) {
    const defaultSettings = {
      apiKey: process.env.API_KEY,
      modelName: process.env.MODEL_NAME,
      apiUrl: process.env.API_URL,
      tokenPrice: process.env.TOKEN_PRICE || 100,
      freeTokens: process.env.FREE_TOKENS || 1000
    };
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings));
  }
};

// 读取用户数据
const getUsers = () => {
  initFiles();
  const data = fs.readFileSync(usersFile, 'utf8');
  return JSON.parse(data);
};

// 保存用户数据
const saveUsers = (users) => {
  initFiles();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// 读取设置数据
const getSettings = () => {
  initFiles();
  const data = fs.readFileSync(settingsFile, 'utf8');
  return JSON.parse(data);
};

// 保存设置数据
const saveSettings = (settings) => {
  initFiles();
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
};

// 导出方法
module.exports = {
  getUsers,
  saveUsers,
  getSettings,
  saveSettings
};