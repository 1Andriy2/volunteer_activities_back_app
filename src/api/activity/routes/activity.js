'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/activities/recommendations',
        handler: 'activity.recommendations', 
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/activities',
        handler: async (ctx) => {
          try {
            const activities = await strapi.entityService.findMany(
              'api::activity.activity',
              {
                populate: '*', 
              }
            );
            ctx.body = activities; 
          } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Не вдалося отримати активності', details: error.message };
          }
        },
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  