'use strict';

const axios = require('axios');

module.exports = {
  async afterCreate(event) {
    const { result } = event; // Новостворена подія
    const activityTitle = result.title;

    // Отримання всіх користувачів із pushToken
    const users = await strapi.query('plugin::users-permissions.user').findMany({
      where: { pushToken: { $notNull: true } },
    });

    if (users.length === 0) {
      console.log('Немає користувачів для відправки сповіщень.');
      return;
    }

    // Формування push-повідомлень
    const messages = users.map((user) => ({
      to: user.pushToken,
      sound: 'default',
      title: 'Нова подія!',
      body: `Додано нову подію: ${activityTitle}. Перегляньте зараз.`,
      data: { activityId: result.id },
    }));

    try {
      // Відправка повідомлень через Expo Push Notification API
      const response = await axios.post('https://exp.host/--/api/v2/push/send', messages, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const strapiResponse =  await strapi.entityService.create('api::notification.notification', {
        data: {
          title: 'Нова подія!', 
          message: `Додано нову подію: ${activityTitle}. Перегляньте зараз.`,
        },
      });

      console.log('Expo Push Response:', response.data);
    } catch (error) {
      console.error('Помилка при відправці push-сповіщень:', error.message);
    }
  },
  async afterUpdate(event) {
    const { result } = event; 
    const updatedTitle = result.title;

    const users = await strapi.query('plugin::users-permissions.user').findMany({
      where: { pushToken: { $notNull: true } },
    });

    if (users.length === 0) {
      console.log('Немає користувачів для відправки сповіщень.');
      return;
    }

    const messages = users.map((user) => ({
      to: user.pushToken,
      sound: 'default',
      title: 'Подію оновлено!',
      body: `Оновлено подію: ${updatedTitle}. Перегляньте останні зміни.`,
      data: { activityId: result.id },
    }));

    try {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', messages, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Збереження сповіщень у базі даних
      await strapi.entityService.create('api::notification.notification', {
        data: {
          title: 'Подію оновлено!',
          message: `Оновлено подію: ${updatedTitle}. Перегляньте останні зміни.`,
        },
      });

      console.log('Expo Push Response:', response.data);
    } catch (error) {
      console.error('Помилка при відправці push-сповіщень:', error.message);
    }
  },
};
