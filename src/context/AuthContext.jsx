import React , {createContext, useContext , useState} from 'react'
import axios from 'axios';
import { useEffect } from 'react';


export const UserDataContext = createContext();

const AuthContext = ({ children }) => {

  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  // Get Current Logged In User
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    axios.get(
      `${import.meta.env.VITE_BASE_URL}v1/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => {

        if (res.status === 200) {
          setUser(res.data.user);
        }

      })
      .catch((err) => {
        localStorage.removeItem("token");
        setUser({});
        setError(
          err.response?.data?.message ||
          "Authentication failed"
        );

      })
      .finally(() => {
        setIsLoading(false);
      });

  }, []);



  // Login
  const login = async (email, password) => {

    try {

      setError(null);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}v1/auth/login`,
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      setUser(res.data.user);

      return {
        success: true
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        "Login failed";

      setError(message);

      return {
        success: false,
        message
      };

    }

  };



  // Logout
  const logout = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    setUser({});

  };



  const value = {
    user,
    setUser,
    isLoading,
    error,
    setError,
    login,
    logout,
    isAuthenticated: !!user?._id,
  };



  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default AuthContext;


export const useAuth = () => {
  return useContext(UserDataContext);
};
