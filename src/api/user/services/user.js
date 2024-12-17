'use strict';

const axios = require('axios');

module.exports = {
  async sendPushNotification(tokens, title, body, data) {
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    }));

    try {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', messages, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Expo Push Response:', response.data);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  },
};
