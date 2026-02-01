const axios = require('axios');
const User = require('../models/User');
const Setting = require('../models/Setting');

// 聊天页面
exports.chatPage = async (req, res) => {
  try {
    // 获取用户信息
    const user = await User.findById(req.user.id);
    
    // 获取系统设置
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
    
    res.render('chat', {
      user,
      setting
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '加载聊天页面失败');
    res.redirect('/');
  }
};

// 发送消息
exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  
  try {
    console.log('sendMessage called');
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);
    
    // 获取用户信息
    const user = await User.findById(req.user.id);
    console.log('User found:', user);
    console.log('User tokens:', user.tokens);
    console.log('User tokens <= 0:', user.tokens <= 0);
    
    // 检查用户token是否足够
    if (user.tokens <= 0) {
      console.log('Token check failed: tokens <= 0');
      return res.json({ error: 'err412 你的账户余额不足' });
    }
    console.log('Token check passed: tokens > 0');

    
    // 获取系统设置
    let setting = await Setting.findOne();
    if (!setting) {
      // 如果没有设置，使用默认设置
      setting = {
        apiKey: process.env.API_KEY,
        modelName: process.env.MODEL_NAME,
        apiUrl: process.env.API_URL
      };
    }
    
    // 调用AI API
    const response = await axios.post(setting.apiUrl || process.env.API_URL, {
      model: setting.modelName || process.env.MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: '你是一个智能助手，帮助用户解答问题。'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${setting.apiKey || process.env.API_KEY}`
      }
    });
    
    // 计算使用的token数量（这里简化处理，实际应该根据API返回的usage计算）
    const usedTokens = Math.ceil((message.length + response.data.choices[0].message.content.length) / 4);
    
    // 扣除用户token
    console.log('Deducting tokens:', usedTokens);
    user.tokens = Math.max(0, user.tokens - usedTokens);
    await user.save();
    console.log('Tokens after deduction:', user.tokens);
    
    res.json({ 
      response: response.data.choices[0].message.content,
      usedTokens,
      remainingTokens: user.tokens
    });
  } catch (err) {
    console.error(err);
    res.json({ error: '发送消息失败，请重试' });
  }
};

// 充值页面
exports.rechargePage = (req, res) => {
  res.render('recharge');
};

// 充值处理（这里只是展示，实际需要集成支付系统）
exports.recharge = (req, res) => {
  req.flash('success_msg', '充值功能暂未开放，请联系管理员手动充值');
  res.redirect('/chat');
};
