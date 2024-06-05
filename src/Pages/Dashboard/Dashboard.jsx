import style from "./Dashboard.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { Col, Row } from "react-bootstrap";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { ShowContext } from "../../context/ShowContext";
import { color, motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import List from "../../components/List/List";
import { GrCubes } from "react-icons/gr";
import { MdBattery2Bar } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { PiBatteryVerticalEmptyBold } from "react-icons/pi";
import { IoIosAlert } from "react-icons/io";
import { MedicineContext } from "../../context/MedicinesContext";
const Dashboard = () => {
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const { success, setSuccess, user } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(MedicineContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        toast.success(`تم تسجيل الدخول بنجاح! ,\n
        مرحبا بك د/ ${user.username}`);
        setSuccess(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [success, setSuccess, user.username]);

  useDocumentTitle(" التقارير");
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
      <h1 className="mainTitle pb-3">التقارير</h1>
      <Row className="justify-content-center mb-2">
        <Col xl="3" lg="4" md="5" sm="6">
          <List title="اوشك على النفاد" icon={<MdBattery2Bar />} />
        </Col>
        <Col xl="3" lg="4" md="5" sm="6">
          <List title="انتهت صلاحيته" icon={<IoIosAlert />} color={"#f9eaeb"} />
        </Col>
        <Col xl="3" lg="4" md="5" sm="6">
          <List
            title="غير متوفر"
            icon={<PiBatteryVerticalEmptyBold />}
            color="#eaf3f9"
          />
        </Col>
        <Col xl="3" lg="4" md="5" sm="6">
          <List
            title="الأكثر طلباً"
            icon={<FaMoneyBillTrendUp />}
            color="#f8eaf9"
          />
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;
