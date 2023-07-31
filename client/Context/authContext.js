import React, { children, createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [usertoken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const isTokenExpired = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      console.log(decoded.exp < currentTime);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Token decoding error:", error);
      return true;
    }
  };

  const checkTokenExpiration = async () => {
    const userT = await AsyncStorage.getItem("userToken");
    if (userT && isTokenExpired(userT)) {
      try {
        await refreshToken();
      } catch (error) {
        console.log("Failed to refresh token:", error);
        logout(); // Perform a complete logout if token refresh fails
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkTokenExpiration();
    setIsLoading(false);

    const refreshTimer = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Refresh token every 1 minute

    return () => {
      clearInterval(refreshTimer);
    };
  }, []);

  const login = (user, pwd) => {
    setIsLoading(true);
    axios
      .post("http://192.168.43.56:3000/auth", {
        user,
        pwd,
      })
      .then((res) => {
        let userInfo = res.data;
        console.log("auth access token", userInfo);

        setUserInfo(userInfo);
        setUserToken(userInfo.accessToken);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        AsyncStorage.setItem("userToken", userInfo.accessToken);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response && error.response.status === 401) {
          setErrorMessage( "*Nom d'utilisateur ou mot de passe invalide")
        } else {
          setErrorMessage("*Une erreur s'est produite. Veuillez réessayer ultérieurement.")
        }
       
 });
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("userToken");
    setIsLoading(false);
  };
  const refreshToken = async () => {
    try {
      const response = await axios.post("http://192.168.43.56:3000/refresh");
      const newAccessToken = response.data.accessToken;
      console.log("new refresh", newAccessToken);
      setUserToken(newAccessToken);
      AsyncStorage.setItem("userToken", newAccessToken);
    } catch (error) {
      console.log("refreshToken error:", error);
      logout();
    }
  };
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userT = await AsyncStorage.getItem("userToken");
      userInfo = JSON.parse(userInfo);
      if (userInfo && !isTokenExpired(userT)) {
        setUserToken(userT);
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.log("isLoggedIn error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, usertoken, isLoading, userInfo ,errorMessage}}
    >
      {children}
    </AuthContext.Provider>
  );
};
