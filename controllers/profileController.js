const User = require('../models/User');

// 显示个人资料页面
exports.profilePage = async (req, res) => {
  try {
    // 获取用户信息
    const user = await User.findById(req.user.id);
    
    res.render('profile', {
      user,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载个人资料失败');
    res.redirect('/chat');
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  try {
    // 获取用户信息
    const user = await User.findById(req.user.id);
    
    // 验证当前密码
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      req.flash('error_msg', '当前密码错误');
      return res.redirect('/profile');
    }
    
    // 验证新密码和确认密码
    if (newPassword !== confirmPassword) {
      req.flash('error_msg', '新密码和确认密码不一致');
      return res.redirect('/profile');
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    req.flash('success_msg', '密码修改成功');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '修改密码失败');
    res.redirect('/profile');
  }
};

// 修改邮箱
exports.changeEmail = async (req, res) => {
  const { currentEmail, newEmail } = req.body;
  
  try {
    // 获取用户信息
    const user = await User.findById(req.user.id);
    
    // 验证当前邮箱
    if (user.email !== currentEmail) {
      req.flash('error_msg', '当前邮箱错误');
      return res.redirect('/profile');
    }
    
    // 检查新邮箱是否已被使用
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser.id !== user.id) {
      req.flash('error_msg', '新邮箱已被使用');
      return res.redirect('/profile');
    }
    
    // 更新邮箱
    user.email = newEmail;
    await user.save();
    
    req.flash('success_msg', '邮箱修改成功');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '修改邮箱失败');
    res.redirect('/profile');
  }
};

// 注销账户
exports.deleteAccount = async (req, res) => {
  const { confirmUsername } = req.body;
  
  try {
    // 获取用户信息
    const user = await User.findById(req.user.id);
    
    // 验证用户名
    if (user.username !== confirmUsername) {
      req.flash('error_msg', '用户名确认错误');
      return res.redirect('/profile');
    }
    
    // 删除用户
    await User.findByIdAndDelete(user.id);
    
    // 登出用户
    req.logout((err) => {
      if (err) {
        console.error(err);
      }
      req.flash('success_msg', '账户已成功注销');
      res.redirect('/login');
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '注销账户失败');
    res.redirect('/profile');
  }
};
