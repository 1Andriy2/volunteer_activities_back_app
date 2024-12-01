'use strict';

/**
 * event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = {
  // Викликаємо стандартний метод для створення сервісу
  ...createCoreService('api::event.event'),

  // lifecycle hooks
  async beforeCreate(data) {
    const currentDate = new Date();
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (currentDate < startDate) {
      data.status = 'soon'; // Подія ще не почалась
    } else if (currentDate >= startDate && currentDate <= endDate) {
      data.status = 'active'; // Подія активна
    } else if (currentDate > endDate) {
      data.status = 'completed'; // Подія завершена
    }
  },

  async beforeUpdate(params, data) {
    const currentDate = new Date();
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (currentDate < startDate) {
      data.status = 'soon'; // Подія ще не почалась
    } else if (currentDate >= startDate && currentDate <= endDate) {
      data.status = 'active'; // Подія активна
    } else if (currentDate > endDate) {
      data.status = 'completed'; // Подія завершена
    }
  },
};
