module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/auth/login-phone-or-email',
        handler: 'auth.loginByPhoneOrEmail',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  