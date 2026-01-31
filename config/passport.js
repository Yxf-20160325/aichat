const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: '该邮箱未注册' });
        }
        
        // 检查用户是否被封禁
        if (user.isBanned) {
          // 检查封禁是否过期
          if (user.banExpiry && user.banExpiry < new Date()) {
            // 封禁过期，自动解封
            user.isBanned = false;
            user.banExpiry = null;
            await user.save();
          } else {
            return done(null, false, { message: '您的账户已被封禁' });
          }
        }
        
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return done(null, false, { message: '密码错误' });
        }
        
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};