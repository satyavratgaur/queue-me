import { useState } from 'react';
import { useRouter } from 'next/router';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const [verificationMessage, setVerificationMessage] = useState('');
  const { phoneNumber } = router.query; // Get the phone number from the query parameter

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setVerificationMessage('Code verified Successfully!');
        console.log('OTP verification successful:', data.message);
        // Handle successful verification, perhaps redirect to a success page or display a message
      } else {
        setVerificationMessage('Cannot verify code you provided');
        console.error('OTP verification failed:', data.message);
        // Handle failed verification, display an error message to the user
      }
    } catch (error) {
      setVerificationMessage(
        'An error occurred during verification. Please try again.'
      );
      console.error('Failed to verify OTP:', error);
      // Handle network or server error
    }
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center bg-white space-y-4'>
      <h1 className='text-lg font-bold mb-4'>Verify OTP</h1>
      <form
        className='bg-gray-50 p-6 rounded-lg shadow-md'
        onSubmit={verifyOtp}
      >
        <input
          type='tel'
          placeholder='Phone number'
          className='border p-2 rounded w-full'
          value={phoneNumber as string} // Type-casting since router.query returns string | string[]
          readOnly
        />
        <input
          type='text'
          placeholder='Enter OTP'
          className='border p-2 rounded w-full mt-4'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full'
        >
          Verify OTP
        </button>
      </form>
      {verificationMessage && (
        <div className='mt-4 text-center font-semibold'>
          {verificationMessage}
        </div>
      )}
    </div>
  );
};

export default VerifyOTP;
