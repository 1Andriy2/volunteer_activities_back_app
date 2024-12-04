module.exports = {
    '0 10 * * *': async () => {  // Цей cron запускається кожен день о 10:00
      try {
        // Отримуємо події, які будуть відбуватись через кілька годин
        const events = await strapi.db.query('api::activity.activity').findMany({ 
          where: {
            eventDate: {
              $gt: new Date(),
              $lt: new Date(new Date().getTime() + 6 * 60 * 60 * 1000), // Події в наступні 6 годин
            }
          }
        });
  
        // Перевірте, чи є події
        if (events.length > 0) {
          // Отримуємо токени користувачів, які зареєстровані на ці події
          const users = await strapi.db.query('api::user.user').findMany({
            where: {
              id: {
                $in: events.map(event => event.user.id)  // Замість event.user, використовуємо event.user.id
              }
            }
          });
  
          const tokens = users.map(user => user.pushToken).filter(Boolean);
  
          // Надсилаємо сповіщення
          if (tokens.length > 0) {
            await strapi.services.notification.sendExpoPushNotification(
              tokens,
              'Нагадування про подію!',
              `Подія "${events[0].title}" відбудеться через кілька годин!`,  // Виправлено доступ до title
              { eventId: events[0].id }  // Виправлено доступ до id
            );
          }
        }
      } catch (err) {
        console.error('Error sending notifications: ', err);
      }
    },
  };
  