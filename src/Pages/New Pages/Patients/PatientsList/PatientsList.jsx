import style from "./PatientsList.module.css";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import MedicineItem from "./../../../../components/MedicineItem/MedicineItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../context/ShowContext";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "./../../../../context/MedicinesContext";
import AddWithPrint from "../../../../components/AddWithPrint/AddWithPrint";
const PatientsList = () => {
  const [disableSearchBar , setDisableSearchBar] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [searchType, setSearchType] = useState("national");
  const [patients, setPatients] = useState([]);
  const { fetchPatients, loading, setLoading, error, setError } =
    useContext(MedicineContext);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  let { type } = useParams();
  const realType = type;
  const navigate = useNavigate();
  type =
    type === "chronic"
      ? "مزمن"
      : type === "emergency"
      ? "غير مزمن"
      : type === "all"
      ? "جميع المرضى"
      : "";
  useEffect(() => {
    if (type === "") {
      navigate("/404");
    }
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const isMount = useRef(false);
  useEffect(() => {
    const newPatients = items;
    if (value.trim() === "") {
      setPatients([...newPatients]);
      return;
    } else {
      const newValue = value.toLowerCase();
      if (searchType === "national") {
        const patients = newPatients.filter((patient) => {
          return patient.nationalid.toString().startsWith(newValue);
        });
        setPatients(patients);
  
      } else if (searchType === "name") {
        const patients = newPatients.filter((patient) => {
          return patient.name.toLowerCase().startsWith(newValue);
        });
        setPatients(patients);
      }
    }
  }, [value]);
  useDocumentTitle(type);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await fetchPatients(realType);
        setItems(data);
        setPatients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (!isMount.current) {
      func();
      isMount.current = true;
    }  }, [fetchPatients, type]);
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
      <LinkWithBack link="/patients" title={type} />
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
                  searchType === "national"
                    ? "ادخل الرقم القومي للطالب"
                    : searchType === "name"
                    ? "ادخل اسم الطالب"
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
              <option value="national">الرقم القومي للطالب</option>
              <option value="name">اسم الطالب</option>
            </Form.Select>
          </Col>
        </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && patients.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && patients.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>الرقم القومي</p>
                  <p>اسم المريض</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && patients.length > 0 ? (
                patients.map((pateint) => (
                  <MedicineItem
                    mainType="patients"
                    type={realType}
                    className="mb-2"
                    key={pateint.nationalid}
                    idx={pateint.nationalid}
                    name={pateint.name}
                  />
                ))
              ) : !loading && !error && patients.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint message={"اضافة مريض جديد"} link={"/patients/add-new-patient?return=true"} />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default PatientsList;
