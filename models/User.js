const { getUsers, saveUsers } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.tokens = 'tokens' in data ? data.tokens : 1000; // 初始免费1000token，使用'tokens' in data检查确保0值被正确处理
    this.isAdmin = data.isAdmin || false;
    this.isBanned = data.isBanned || false;
    this.banExpiry = data.banExpiry;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // 保存用户
  async save() {
    const users = getUsers();
    const existingIndex = users.findIndex(user => user.id === this.id);
    
    // 加密密码（如果密码被修改）
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    
    // 创建纯数据对象，确保所有必要属性都被保存
    const userData = {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      tokens: this.tokens,
      isAdmin: this.isAdmin,
      isBanned: this.isBanned,
      banExpiry: this.banExpiry,
      createdAt: this.createdAt
    };
    
    if (existingIndex >= 0) {
      // 更新现有用户
      users[existingIndex] = userData;
    } else {
      // 添加新用户
      users.push(userData);
    }
    
    saveUsers(users);
    return this;
  }

  // 验证密码
  async matchPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // 根据邮箱查找用户
  static async findOne({ email }) {
    const users = getUsers();
    const user = users.find(user => user.email === email);
    return user ? new User(user) : null;
  }

  // 根据ID查找用户
  static async findById(id) {
    const users = getUsers();
    const user = users.find(user => user.id === id);
    return user ? new User(user) : null;
  }

  // 查找所有用户
  static async find() {
    const users = getUsers();
    return users.map(user => new User(user));
  }

  // 根据ID删除用户
  static async findByIdAndDelete(id) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    saveUsers(filteredUsers);
    return true;
  }
}

module.exports = User;
