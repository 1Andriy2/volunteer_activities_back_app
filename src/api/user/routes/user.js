module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/login-phone-or-email',
      handler: 'user.loginByPhoneOrEmail', 
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/users/:id/push-token',
      handler: 'user.updatePushToken',
      config: {
        policies: [],
      },
    },
  ],
};
