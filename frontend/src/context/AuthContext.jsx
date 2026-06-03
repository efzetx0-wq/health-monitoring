import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const userData =
        localStorage.getItem(
          "user"
        );

      // SET TOKEN HEADER
      if (token) {

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      // LOAD USER
      if (userData) {

        setUser(
          JSON.parse(userData)
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }

  }, []);

  // LOGIN
  const login = async (
    email,
    password
  ) => {

    const response =
      await api.post(
        "/login",
        {
          email,
          password
        }
      );

    const token =
      response.data.token;

    const user =
      response.data.user;

    // SAVE TOKEN
    localStorage.setItem(
      "token",
      token
    );

    // SAVE USER
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // SET HEADER
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser(user);

    return response.data;
  };

  // REGISTER
  const register = async (
    data
  ) => {

    const response =
      await api.post(
        "/register",
        data
      );

    return response.data;
  };

  // LOGOUT
  const logout = async () => {

    try {

      await api.post(
        "/logout"
      );

    } catch (error) {

      console.log(error);
    }

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    delete api.defaults.headers.common[
      "Authorization"
    ];

    setUser(null);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(
    AuthContext
  );
}