const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// 首页
router.get('/', authController.home);

// 注册页面
router.get('/register', authController.registerPage);

// 注册处理
router.post('/register', authController.register);

// 登录页面
router.get('/login', authController.loginPage);

// 登录处理
router.post('/login', passport.authenticate('local', {
  successRedirect: '/chat',
  failureRedirect: '/login',
  failureFlash: true
}));

// 登出
router.get('/logout', authController.logout);

// 关于页面
router.get('/about', (req, res) => {
  if (!req.user) {
    req.flash('error_msg', '请先登录');
    return res.redirect('/login');
  }
  res.render('about', { user: req.user });
});

module.exports = router;
