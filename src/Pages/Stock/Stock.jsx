import useDocumentTitle from "../../hooks/useDocumentTitle";
import style from "./Stock.module.css";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import MenuItem from "../../components/MenuItem/MenuItem";
import { useContext } from "react";
import { ShowContext } from "../../context/ShowContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "./../../context/AuthContext";
import { toast } from "react-toastify";
import { MedicineContext } from "../../context/MedicinesContext";
const Stock = () => {
  const { success, setSuccess, user } = useContext(AuthContext);
  const {fetchNotifications} = useContext(MedicineContext);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
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
    fetchNotifications();
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
  useDocumentTitle(" إدارة المخازن");
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
      <h1 className="mainTitle pb-2 pb-lg-0">إدارة المخازن</h1>
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="justify-content-center d-flex"
      >
        <Col>
          <MenuItem
            to="/stock/sales"
            title="حصر المبيعات"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
        <Col>
          <MenuItem
            to="/stock/medicines"
            title="الأدوية"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
      </Row>
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="pt-md-2 justify-content-center d-flex"
      >
        <Col>
          <MenuItem
            to="/stock/inventory"
            title="عهدة المخزن"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
        <Col>
          <MenuItem
            to="/stock/orders"
            title="الواردات"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
      </Row>
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="pt-md-2 mb-2 justify-content-center d-flex "
      >
        <Col>
          <MenuItem
            to="/stock/collages"
            title="حصر الكليات"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
        <Col>
          <MenuItem
            to="/stock/medicine-dispense"
            title="صرف الأدوية"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
      </Row>
    </motion.div>
  );
};

export default Stock;
