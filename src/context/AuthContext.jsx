import { createContext, useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = "https://pharmacy-1xjk.onrender.com/";
  const [aboutToFinish, setAboutToFinish] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const userCookie = Cookies.get("user");
  const userObject = userCookie ? JSON.parse(userCookie) : {};
  const [user, setUser] = useState(
    userCookie
      ? (() => {
          try {
            const token = userObject.token;
            const decodedUser = jwtDecode(token);
            return decodedUser;
          } catch (error) {
            console.error("Error parsing or decoding user:", error);
            return null;
          }
        })()
      : null
  );
  //Check Token Expiry

  const checkTokenExpiry = () => {
    const token = userObject.token;
    const decodedUser = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedUser.exp < currentTime) {
      Cookies.remove("user");
      setUser(null);
      toast.error("انتهت الجلسة , الرجاء تسجيل الدخول مرة اخرى");
    }
  };

  //Check what's time available for the token

  const checkTokenTime = () => {
    const token = userObject.token;
    const decodedUser = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeLeft = decodedUser.exp - currentTime;
    //Convert time to minuites
    const timeLeftInMin = timeLeft / 60;
    return timeLeftInMin;
  };

  // Check if the token is about to finish

  const checkAboutToFinish = () => {
    if (user) {
      const timeLeft = parseInt(checkTokenTime());
      checkTokenExpiry();
      if (
        timeLeft === 30 ||
        timeLeft === 15 ||
        timeLeft === 10 ||
        timeLeft === 5
      ) {
        toast.info(timeLeft === 30 || timeLeft === 15 ? `تبقى ${timeLeft} دقيقة لانتهاء الجلسة` : `تبقى ${timeLeft} دقائق لانتهاء الجلسة`);
      }
    }
  };
  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      checkAboutToFinish();
      isMount.current = true;
      return;
    }
  }, [user]);
  useEffect(() => {
    const timeInterval = setInterval(() => {
      checkAboutToFinish();
    }, 60000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [user]);
  useEffect(() => {
    const userCookie = Cookies.get("user");

    const initializeUser = () => {
      if (userCookie) {
        try {
          const token = userObject.token;
          const decodedUser = jwtDecode(token);
          const us = { token, username: decodedUser.sub };
          // Check additional conditions for a valid user
          if (decodedUser) {
            setUser(JSON.parse(userCookie));
          } else {
            // Invalid user, remove the cookie
            Cookies.remove("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Error parsing or decoding user:", error);
          // Invalid user, remove the cookie
          Cookies.remove("user");
          setUser(null);
        }
      } else {
        console.log("No user found");
      }
    };

    initializeUser();
  }, []); // Empty dependency array to run only once on mount
  const login = async (values) => {
    setError(null);
    setLoading(true);
    const username = values.email;
    const password = values.password;
    const user = await fetch(baseURL + "auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await user.json();
    if (!user.ok) {
      if (data.message === "Bad credentials") {
        toast.error("اسم المستخدم او كلمة المرور غير صحيحة");
      } else {
        toast.error("حدث خطأ ما , الرجاء المحاولة مرة اخرى");
      }
      setLoading(false);
      return;
    } else {
      const token = data.token;
      const decodedUser = jwtDecode(token);
      const user = { token, username: decodedUser.sub };
      Cookies.set("user", JSON.stringify(user));
      setUser(user);
      setSuccess(true);
      setLoading(false);
    }
  };

  const registerUser = useCallback(async (user) => {
    const data = {
      username: user.email,
      password: user.password,
      authority: "admin",
      phone: user.phone,
      name: user.name,
      nationalId: user.national,
    };
    const response = await fetch(baseURL + "pharmacy/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user"))["token"]}`,
      },
    });
    const res = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة حساب");
      } else if (res.message.includes("username")) {
        toast.error("اسم المستخدم موجود بالفعل");
      } else {
        toast.error("حدث خطأ ما , الرجاء المحاولة مرة اخرى");
      }
    }
    return response;
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        error,
        loading,
        success,
        setSuccess,
        registerUser,
        setLoading,
        aboutToFinish,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
