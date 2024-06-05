import style from "./Sales.module.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShowContext } from "../../../context/ShowContext";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../context/MedicinesContext";
import MedicineItem from "../../../components/MedicineItem/MedicineItem";
import ButtonSubmit from "./../../../components/ButtonSubmit";
const Sales = () => {
  const [date, setDate] = useState({
    month: 0,
    year: 0,
  });
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const { loading, setLoading, error, fetchSales } =
    useContext(MedicineContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const [data, setData] = useState([
    {
      name: "",
      barcode: "",
      amount: "",
    },
  ]);
  const fetchReports = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchSales(date.month, date.year);
      setData(res);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  useDocumentTitle("حصر المبيعات");
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
      className={style.Sales + " d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link="/stock" title={`حصر المبيعات`} />
      <Row className="justify-content-center mb-2">
        <Container className="d-flex justify-content-center align-items-center m-auto">
          <div style={{ width: "90%" }}>
            <Form onSubmit={fetchReports}>
              <Row>
                <Col xs="5" md="5">
                  <Form.Select
                    onChange={(e) => {
                      setDate({ ...date, month: parseInt(e.target.value) });
                    }}
                  >
                    <option value="">اختر الشهر</option>
                    <option value="1">يناير</option>
                    <option value="2">فبراير</option>
                    <option value="3">مارس</option>
                    <option value="4">ابريل</option>
                    <option value="5">مايو</option>
                    <option value="6">يونيو</option>
                    <option value="7">يوليو</option>
                    <option value="8">اغسطس</option>
                    <option value="9">سبتمبر</option>
                    <option value="10">اكتوبر</option>
                    <option value="11">نوفمبر</option>
                    <option value="12">ديسمبر</option>
                  </Form.Select>
                </Col>
                <Col xs="4" md="5">
                  <Form.Select
                    onChange={(e) => {
                      setDate({ ...date, year: parseInt(e.target.value) });
                    }}
                  >
                    <option value="">اختر السنة</option>
                    {new Array(11).fill(0).map((_, idx) => (
                      <option
                        key={idx}
                        value={parseInt(new Date().getFullYear()) - 4 + idx}
                      >
                        {parseInt(new Date().getFullYear()) - 4 + idx}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs="3" md="2">
                  <ButtonSubmit
                    disabled={date.year === 0 || date.month === 0 || loading}
                    className="w-100 btn-main"
                  >
                    {loading ? "جاري التحميل..." : "بحث"}{" "}
                  </ButtonSubmit>
                </Col>
              </Row>
            </Form>{" "}
            <Row className="w-100 m-0 ">
              <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
                {loading &&
                !error &&
                (data.length === 0 || data[0].barcode === "") ? (
                  <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                    جاري التحميل...
                  </div>
                ) : !loading && !error && data.length > 0 && data[0].barcode ? (
                  <div
                    className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                  >
                    <p>الباركود</p>
                    <p>اسم الدواء</p>
                    <p>المادة الفعالة</p>
                    <p>الكمية</p>
                  </div>
                ) : error ? (
                  <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                    عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                  </p>
                ) : (
                  ""
                )}
                {!error && data.length > 0 && data[0].barcode ? (
                  data.map((precision, idx) => (
                    <MedicineItem
                      mainType="inventory"
                      className="mb-2"
                      to={"/stock/medicines/info/" + precision.barcode}
                      key={precision.barcode}
                      id={precision.barcode}
                      idx={precision.barcode}
                      name={precision.name}
                      quantity={precision.amount}
                    />
                  ))
                ) : !loading &&
                  !error &&
                  (data.length === 0 || data[0].barcode === "") ? (
                  <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                    عذراً , لا توجد نتائج
                  </p>
                ) : (
                  ""
                )}
                <div className="d-flex justify-content-end align-items-end">
                  <Button
                    className={`${style.btn} mt-3`}
                    onClick={() => window.print()}
                  >
                    طباعة
                  </Button>
                </div>
              </Container>
            </Row>
          </div>
        </Container>
      </Row>
    </motion.div>
  );
};

export default Sales;
