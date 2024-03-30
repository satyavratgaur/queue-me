// pages/api/send-otp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

// Initialize Twilio client
const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { phoneNumber } = req.body;
  console.log('The phone number is', phoneNumber);

  // Validate phone number format or any other validations as needed
  // ...

  try {
    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: phoneNumber, channel: 'sms' });

      // Respond with success status
      res.status(200).json({ status: verification.status });
    } else {
      throw new Error(
        'Twilio Verification Service SID is not defined in environment variables.'
      );
    }
  } catch (error) {
    // Handle error cases, e.g., invalid phone number, Twilio errors, etc.
    if (error instanceof Error) {
      console.error(error.message);
      // Check if error is a Twilio error with additional properties
      if ('code' in error) {
        return res.status(400).json({
          error: error.message,
          code: error['code'],
        });
      }
      // Otherwise, it's a regular error
      return res.status(500).json({ error: error.message });
    } else {
      // If error is not an instance of Error, it's an unexpected error type
      console.error('An unexpected error occurred');
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}
