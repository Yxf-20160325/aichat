const { getSettings, saveSettings } = require('../config/db');

class Setting {
  constructor(data) {
    this.apiKey = data.apiKey;
    this.modelName = data.modelName;
    this.apiUrl = data.apiUrl;
    this.tokenPrice = data.tokenPrice || 100;
    this.freeTokens = data.freeTokens || 1000;
    this.updatedAt = new Date().toISOString();
  }

  save() {
    saveSettings(this);
    return this;
  }

  static findOne() {
    const setting = getSettings();
    return setting ? new Setting(setting) : null;
  }
}

module.exports = Setting;