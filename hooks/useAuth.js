// hooks/useAuth.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/entry'); // Replace '/entry' with the path to your login page
    }
  }, [router]);
};

export default useAuth;