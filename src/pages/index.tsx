// pages/index.tsx
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter(); // Initialize the router

  const handleQueueClick = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Assume that if the response is OK, the OTP was sent successfully
      // Now navigate to the verifyotp page with the phone number as a query parameter
      router.push({
        pathname: '/verifyotp',
        query: { phoneNumber }, // Pass the phone number as a query parameter
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // You should display an error message to the user
    }
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center bg-white space-y-4'>
      <Head>
        <title>Queue Me</title>
        <meta
          name='description'
          content='Enter your phone number to join the queue'
        />
      </Head>

      {/* Dialog box */}
      <form
        className='bg-gray-50 p-6 rounded-lg shadow-md'
        onSubmit={handleQueueClick}
      >
        <h1 className='text-lg font-bold mb-4'>Enter Phone Number</h1>
        <input
          type='tel'
          placeholder='Your phone number'
          className='border p-2 rounded w-full'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full'
        >
          Queue-Me
        </button>
      </form>

      {/* Navbar icon "About" */}
      <nav className='absolute top-0 right-0 p-4'>
        <a
          href='/about'
          className='text-sm font-semibold text-gray-700 hover:text-gray-900'
        >
          About
        </a>
      </nav>
    </div>
  );
};

export default Home;
