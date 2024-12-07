// module.exports = {
//     '0 10 * * *': async () => {  
//       try {
//         const events = await strapi.db.query('api::activity.activity').findMany({ 
//           where: {
//             eventDate: {
//               $gt: new Date(),
//               $lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 
//             }
//           }
//         });
  
//         if (events.length > 0) {
//           const users = await strapi.db.query('api::user.user').findMany({
//             where: {
//               id: {
//                 $in: events.map(event => event.user.id)  
//               }
//             }
//           });
  
//           const tokens = users.map(user => user.pushToken).filter(Boolean);
  
//           if (tokens.length > 0) {
//             await strapi.services.notification.sendExpoPushNotification(
//               tokens,
//               'Нагадування про подію!',
//               `Подія "${events[0].title}" відбудеться через кілька годин!`, 
//               { eventId: events[0].id } 
//             );
//           }
//         }
//       } catch (err) {
//         console.error('Error sending notifications: ', err);
//       }
//     },
//   };
  