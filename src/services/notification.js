module.exports = {
    async sendExpoPushNotification(tokens, title, body, data) {
      // Виконання динамічного імпорту всередині асинхронної функції
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
  