import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { phoneNumber, otp } = req.body;

  // Validate the input
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Missing phone number or OTP code.' });
  }

  try {
    // Use the verification check API to verify the user's OTP code
    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
      const verificationCheck = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: phoneNumber, code: otp });

      console.log('This is the verification Check', verificationCheck);

      // Check if verification was successful
      if (verificationCheck.status === 'approved') {
        res
          .status(200)
          .json({ success: true, message: 'OTP Verified Successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid OTP Code' });
      }
    } else {
      throw new Error(
        'Twilio Verification Service SID is not defined in environment variables.'
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: error.message });
    } else {
      console.error('An unexpected error occurred');
      res
        .status(500)
        .json({ success: false, error: 'An unexpected error occurred' });
    }
  }
}
