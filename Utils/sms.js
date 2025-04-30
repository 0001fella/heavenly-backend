const Africastalking = require('africastalking'); // Africa's Talking Node.js SDK

// Initialize Africa's Talking service
const AT = Africastalking({ apiKey: process.env.AFRICASTALKING_API_KEY, username: process.env.AFRICASTALKING_USERNAME });

const sendSMS = async (phoneNumber, message) => {
  const sms = AT.SMS;

  try {
    const response = await sms.send({
      to: phoneNumber,      // The recipient's phone number
      message,              // Message content
      from: process.env.AFRICASTALKING_SENDER_ID,  // Sender ID (shortcode)
    });

    console.log('SMS sent successfully:', response);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;  // To ensure error is propagated if needed
  }
};

module.exports = { sendSMS };
