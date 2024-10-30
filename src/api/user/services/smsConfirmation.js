const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
  async sendSMS(phoneNumber, code) {
    try {
      const message = await client.messages.create({
        body: `Your confirmation code is: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      return message;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },
};
