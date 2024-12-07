'use strict';

/**
 * activity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::activity.activity', ({ strapi }) => ({
  async create(ctx) {
    // Викликаємо базову функцію створення
    const response = await super.create(ctx);

    // Отримуємо створений об'єкт події
    const activity = response.data;

    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: { pushToken: { $notNull: true } }, // Тільки користувачі з push-токенами
    });

    // Відправляємо сповіщення кожному користувачу
    for (const user of users) {
      await strapi.services['api::user.user'].sendPushNotification(
        user.pushToken, // Push-токен користувача
        'Нова подія!',
        `Подія "${activity.attributes.title}" відбудеться ${activity.attributes.date}`,
        { activityId: activity.id } // Додаткові дані
      );
    }

    return response;
  },
}));
