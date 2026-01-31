// 检查用户是否已登录
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 检查用户是否被封禁
    if (req.user.isBanned) {
      // 检查封禁是否过期
      if (req.user.banExpiry && req.user.banExpiry < new Date()) {
        // 封禁过期，自动解封
        req.user.isBanned = false;
        req.user.banExpiry = null;
        req.user.save();
        return next();
      } else {
        req.flash('error_msg', '您的账户已被封禁');
        return res.redirect('/login');
      }
    }
    return next();
  }
  req.flash('error_msg', '请先登录');
  res.redirect('/login');
};

// 检查用户是否为管理员
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', '权限不足');
  res.redirect('/chat');
};