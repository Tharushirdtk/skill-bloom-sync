import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../apis/userApi";

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({ type: "SET_USER", payload: user });
      } catch {
        authAPI.logout();
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async ({ email, password }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const { data } = await authAPI.login({ email, password });
      const { token, user } = data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
      return { success: true, user }; // return role to component
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: msg });
      return { success: false };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const { data } = await authAPI.register(userData);
      const { token, user } = data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      dispatch({ type: "SET_ERROR", payload: msg });
      return { success: false };
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => dispatch({ type: "SET_ERROR", payload: null });

  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "SET_USER", payload: user });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
