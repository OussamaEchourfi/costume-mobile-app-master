import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import authService from '../Services/authService';

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true; // avoid duplicate in React dev mode

    const init = async () => {
      try {
        const token = await authService.getCurrentToken();
        if (!token) {
          setUser(null);
          return;
        }
        const res = await authService.validateToken();
        if (res?.success && res?.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await authService.validateToken();
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
