// src/api/user/controllers/auth.js

const twilio = require('twilio');
const client = twilio('AC09ab0ee8d184ba5f20751bb1a9245207', '327956f8030f5ca13dbc48b21bba3ae0');

module.exports = {
  async sendPhoneVerification(ctx) {
    const { phone } = ctx.request.body;
    if (!phone) return ctx.badRequest("Phone number is required");

    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

    try {
      await client.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      // Store verification code and phone temporarily, e.g., in Redis or Strapi's database
      await strapi.query('plugin::users-permissions.user').update({
        where: { phone },
        data: { verificationCode },
      });

      ctx.send({ message: "Verification code sent" });
    } catch (error) {
      console.error("Error sending SMS:", error);
      ctx.internalServerError("Failed to send verification code");
    }
  },
};
