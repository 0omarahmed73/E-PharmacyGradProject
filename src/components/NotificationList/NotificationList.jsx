import React, { useContext, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import style from "./NotificationList.module.css";
import { AiFillBell } from "react-icons/ai";
import { ShowContext } from "../../context/ShowContext";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { BsBell, BsBellFill } from "react-icons/bs";
import NotificationItem from "./../NotificationItem/NotificationItem";
import { Link } from "react-router-dom";
import { MedicineContext } from "../../context/MedicinesContext";
import { ToastContainer, toast } from "react-toastify";
const NotificationList = () => {
  useEffect(() => {
    localStorage.removeItem("oldNum");
  }, []);
  const { showNotifications, setShowNotifications, show, setShow } =
    useContext(ShowContext);
  const { notificationsData, notifications } = useContext(MedicineContext);
  const [lastNotifiedCount, setLastNotifiedCount] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("oldNum")) {
      if (
        notificationsData.length !== parseInt(localStorage.getItem("oldNum")) &&
        notificationsData.length !== lastNotifiedCount
      ) {
        console.log(localStorage.getItem("oldNum"));
        localStorage.setItem("oldNum", notificationsData.length);
        toast.info("تم تحديث الإشعارات");
        setLastNotifiedCount(notificationsData.length);
      }
    } else if (notificationsData.length !== 0) {
      localStorage.setItem("oldNum", notificationsData.length);
    }
  }, [notificationsData.length, lastNotifiedCount]);
  return (
    <>
      {showNotifications ? (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className={style.arrow}
        ></motion.div>
      ) : (
        ""
      )}
      <div
        className={style.dropdown}
        onClick={() => {
          setShowNotifications((d) => !d);
        }}
      >
        <Icon icon={<AiFillBell />}>
          {notificationsData.length > 0 ? (
            <p className={style.redsign}>
              {notificationsData.length > 9 ? "9+" : notificationsData.length}
            </p>
          ) : (
            ""
          )}

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={`${style.dropdownContent}`}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0 }}
              >
                <div className={style.notificationList}>
                  {notificationsData.length > 0 ? (
                    notificationsData
                      .slice(0, 3)
                      .map((notification, index) => (
                        <NotificationItem
                          key={index}
                          name={notification.name}
                          notification={notification.message}
                        />
                      ))
                  ) : (
                    <NotificationItem
                      no={true}
                      key={"1"}
                      name={"لا يوجد إشعارات"}
                      notification={""}
                    />
                  )}
                  <Link style={{ textDecoration: "none" }} to="/notifications">
                    <div className={style.showMore}>
                      <p
                        onClick={() => {
                          setShow(false);
                          localStorage.setItem("sidebar", !show);
                        }}
                      >
                        ...عرض المزيد
                      </p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Icon>
      </div>
    </>
  );
};

export default NotificationList;
