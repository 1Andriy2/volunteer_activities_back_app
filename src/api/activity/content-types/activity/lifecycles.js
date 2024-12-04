module.exports = {
    async afterCreate(event) {
      const activity = event.result;
  
      // Отримайте користувачів, які мають отримати сповіщення
      const users = await strapi.db.query('api::user.user').findMany({
        where: { id: activity.user.id },
      });
  
      const tokens = users.map(user => user.pushToken).filter(Boolean);
  
      if (tokens.length > 0) {
        await strapi.services.notification.sendExpoPushNotification(
          tokens,
          'Нова подія!',
          `Подія "${activity.title}" була створена!`,
          { eventId: activity.id }
        );
      }
    },
  
    async afterUpdate(event) {
      const activity = event.result;
  
      // Подібна логіка для оновлення подій
      const users = await strapi.db.query('api::user.user').findMany({
        where: { id: activity.user.id },
      });
  
      const tokens = users.map(user => user.pushToken).filter(Boolean);
  
      if (tokens.length > 0) {
        await strapi.services.notification.sendExpoPushNotification(
          tokens,
          'Оновлення події!',
          `Подію "${activity.title}" було оновлено.`,
          { eventId: activity.id }
        );
      }
    },
  };
  