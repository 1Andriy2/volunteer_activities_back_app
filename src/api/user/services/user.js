'use strict';

module.exports = {
    async sendPushNotification(tokens, title, body, data) {
      const { default: fetch } = await import('node-fetch');
  
      const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data,
      }));
  
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
  
      const result = await response.json();
      console.log('Expo Push Response:', result);
    },
  };
  
