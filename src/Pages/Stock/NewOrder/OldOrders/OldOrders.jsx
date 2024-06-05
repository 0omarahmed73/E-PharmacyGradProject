import style from "./OldOrder.module.css";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import MedicineItem from "../../../../components/MedicineItem/MedicineItem";
import { Link } from "react-router-dom";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../context/ShowContext";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../../context/MedicinesContext";
import AddWithPrint from "../../../../components/AddWithPrint/AddWithPrint";
const OldOrders = () => {
  const [searchType, setSearchType] = useState("num");
  const [value, setValue] = useState("");
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [medicincesAll, setMedicincesAll] = useState([]);
  const [disableSearchBar , setDisableSearchBar] = useState(false);
  const { fetchOrders, loading, error, setError } = useContext(MedicineContext);
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
    const getOrders = items;
    if (value.trim() === "") {
      setOrders([...getOrders]);
      return;
    } else if (searchType === "num") {
      const newValue = value;
      const newOrders = getOrders.filter((order) => {
        return order.supplyrequest.toString().startsWith(newValue);
      });
      setOrders(newOrders);
    } else if (searchType === "name") {
      const newValue = value.toLowerCase();
      const newOrders = getOrders.filter((order) => {
        return order.orderMedicines.find((item) => {
          return item.medicine.name.toLowerCase().startsWith(newValue);
        });
      });
      setOrders(newOrders);
    }
  }, [value]);
  const isMount = useRef(false);
  useEffect(() => {
    const func = async () => {
      try {
        const data = await fetchOrders();
        setItems(data);
        setOrders(data);
      } catch (error) {
        setError(error.message);
      }
    };
    if (!isMount.current) {
      func();
      isMount.current = true;
    }
  }, []);
  useDocumentTitle(`عرض الطلبيات القديمة`);
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
      className={" d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link="/stock/orders" title={`عرض الطلبيات القديمة`} />
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          <Row>
            <Col>
              <Form.Group className={`mt-1`} controlId="search">
                <Form.Control
                  className={`${style.search} `}
                  type="text"
                  disabled={disableSearchBar}
                  style={{ direction: "rtl" }}
                  placeholder={
                    searchType === "num"
                      ? "ادخل طلب الإمداد"
                      : searchType === "name"
                      ? "ادخل اسم الدواء"
                      : ""
                  }
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Select
                className="mt-1"
                label="طريقة البحث"
                id="searchType"
                width={"100%"}
                name="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="num">طلب الإمداد</option>
                <option value="name">اسم الدواء</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && orders.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && orders.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>طلب الإمداد</p>
                  <p>اسم المورد</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && orders.length > 0 ? (
                orders.map((order) => (
                  <MedicineItem
                    mainType="orders"
                    className="mb-2"
                    id={order.id}
                    key={order.id}
                    idx={order.supplyrequest}
                    name={order.supplier.name}
                  />
                ))
              ) : !loading && !error && orders.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint message={"اضافة طلبية جديدة"} link={"/stock/orders/new-order?return=true"} />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default OldOrders;
