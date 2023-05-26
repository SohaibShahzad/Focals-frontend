import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { parseCookies } from "nookies";

const withAuth = (Component) => {
  const AuthenticatedComponent = ({role, ...props}) => {
    const router = useRouter();

    useEffect(() => {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        router.push('/login');
      }
    }, [router]);

    return <Component {...props} role={role} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
