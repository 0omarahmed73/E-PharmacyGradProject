import style from "./Notifications.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { ShowContext } from "../../context/ShowContext";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { Container } from "react-bootstrap";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import { MedicineContext } from "../../context/MedicinesContext";
const NotificationsPage = () => {
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const { loading, error, notificationsData, notifications , fetchNotifications , setLoading} =
    useContext(MedicineContext);
  useEffect(() => {
    fetchNotifications();
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
      setLoading(false)
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useDocumentTitle(" الإشعارات");
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ margin: "auto" }}
      className={style.dashboard + " d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <h1 className="mainTitle py-2">الإشعارات</h1>
      <Container className={`${style.container2222} `}>
        <div className={style.notificationList}>
          {loading && !error && notificationsData.length <= 0 ? (
            <div className="text-center text-black p-0 m-5 fw-bold">
              جاري التحميل...
            </div>
          ) : !loading && !error && notificationsData.length > 0 ? (
            <>
              {notificationsData.map((notification, index) => (
                <NotificationItem
                  listOrPage="page"
                  key={index}
                  name={notification.name}
                  notification={notification.message}
                />
              ))}
              <div className="text-center text-black fw-bold descriptiveP my-3 fontSize12px">
                اخر تحديث : {notifications.time}
              </div>
            </>
          ) : error ? (
            <p className="text-center text-black p-0 m-5 fw-bold">
              عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
            </p>
          ) : (
            <p className="text-center text-black p-0 m-5 fw-bold">
              عذراً , لا يوجد اشعارات
            </p>
          )}
        </div>
      </Container>
    </motion.div>
  );
};

export default NotificationsPage;
