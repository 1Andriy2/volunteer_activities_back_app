'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/activities/recommendations',
        handler: 'activity.recommendations', // цей метод повинен відповідати вашому методу в контролері
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  