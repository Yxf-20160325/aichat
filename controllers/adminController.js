const User = require('../models/User');
const Setting = require('../models/Setting');
const bcrypt = require('bcrypt');

// 管理员首页
exports.adminHome = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/users', { users });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载用户列表失败');
    res.redirect('/admin');
  }
};

// 用户编辑页面
exports.editUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/edit-user', { user });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载用户信息失败');
    res.redirect('/admin');
  }
};

// 编辑用户
exports.editUser = async (req, res) => {
  const { username, email, tokens } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    user.username = username;
    user.email = email;
    user.tokens = parseInt(tokens) || 0;
    await user.save();
    
    req.flash('success_msg', '用户信息更新成功');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '更新用户信息失败');
    res.redirect('/admin/edit/' + req.params.id);
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '用户删除成功');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '删除用户失败');
    res.redirect('/admin');
  }
};

// 更改密码页面
exports.changePasswordPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/change-password', { user });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载用户信息失败');
    res.redirect('/admin');
  }
};

// 更改密码
exports.changePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  
  try {
    if (password !== confirmPassword) {
      req.flash('error_msg', '两次输入的密码不一致');
      return res.redirect('/admin/change-password/' + req.params.id);
    }
    
    const user = await User.findById(req.params.id);
    user.password = password;
    await user.save();
    
    req.flash('success_msg', '密码更改成功');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '更改密码失败');
    res.redirect('/admin/change-password/' + req.params.id);
  }
};

// 封禁用户页面
exports.banUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/ban-user', { user });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载用户信息失败');
    res.redirect('/admin');
  }
};

// 封禁用户
exports.banUser = async (req, res) => {
  const { banType, banDays } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    user.isBanned = true;
    
    if (banType === 'temporary') {
      const banExpiry = new Date();
      banExpiry.setDate(banExpiry.getDate() + parseInt(banDays));
      user.banExpiry = banExpiry;
    } else {
      user.banExpiry = null; // 永久封禁
    }
    
    await user.save();
    req.flash('success_msg', '用户封禁成功');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '封禁用户失败');
    res.redirect('/admin/ban/' + req.params.id);
  }
};

// 解封用户
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBanned = false;
    user.banExpiry = null;
    await user.save();
    
    req.flash('success_msg', '用户解封成功');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '解封用户失败');
    res.redirect('/admin');
  }
};

// 模型设置页面
exports.settingsPage = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      // 如果没有设置，使用默认设置
      setting = {
        apiKey: process.env.API_KEY,
        modelName: process.env.MODEL_NAME,
        apiUrl: process.env.API_URL,
        tokenPrice: process.env.TOKEN_PRICE || 100,
        freeTokens: process.env.FREE_TOKENS || 1000
      };
    }
    res.render('admin/settings', { setting });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载设置页面失败');
    res.redirect('/admin');
  }
};

// 更新模型设置
exports.updateSettings = async (req, res) => {
  const { apiKey, modelName, apiUrl, tokenPrice, freeTokens } = req.body;
  
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }
    
    setting.apiKey = apiKey;
    setting.modelName = modelName;
    setting.apiUrl = apiUrl;
    setting.tokenPrice = parseInt(tokenPrice) || 100;
    setting.freeTokens = parseInt(freeTokens) || 1000;
    
    await setting.save();
    
    req.flash('success_msg', '设置更新成功');
    res.redirect('/admin/settings');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '更新设置失败');
    res.redirect('/admin/settings');
  }
};