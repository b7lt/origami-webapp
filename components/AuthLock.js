import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/backend/Firebase';
import { useStateContext } from '@/context/StateContext';

const AuthLock = ({ children }) => {
    const { user, loading } = useStateContext();
    const router = useRouter();
  
    useEffect(() => {
      if (!loading && !user) {
        // Redirect to login if user is not authenticated
        router.push('/');
      }
    }, [user, loading, router]);
  
    // Show loading state while checking authentication
    if (loading) {
      return <div>Loading...</div>;
    }
  
    // If authenticated, show protected content
    return user ? children : null;
  };

export default AuthLock;