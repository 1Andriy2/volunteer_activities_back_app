module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/auth/send-phone-verification',
        handler: 'auth.sendPhoneVerification',
        config: {
          policies: [],
          auth: false, 
        },
      },
    ],
  };