const User = require('../models/User');

// 注册页面
exports.registerPage = (req, res) => {
  res.render('register');
};

// 注册处理
exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  
  try {
    // 验证密码是否一致
    if (password !== confirmPassword) {
      req.flash('error_msg', '两次输入的密码不一致');
      return res.redirect('/register');
    }
    
    // 检查邮箱是否已注册
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', '该邮箱已注册');
      return res.redirect('/register');
    }
    
    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      req.flash('error_msg', '该用户名已存在');
      return res.redirect('/register');
    }
    
    // 创建新用户
    const newUser = new User({
      username,
      email,
      password
    });
    
    await newUser.save();
    
    req.flash('success_msg', '注册成功，请登录');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '注册失败，请重试');
    res.redirect('/register');
  }
};

// 登录页面
exports.loginPage = (req, res) => {
  res.render('login');
};

// 登出
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    req.flash('success_msg', '已成功登出');
    res.redirect('/login');
  });
};

// 首页
exports.home = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/chat');
  } else {
    res.redirect('/login');
  }
};