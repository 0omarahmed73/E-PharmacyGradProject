import style from "./OldDispenses.module.css";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import MedicineItem from "./../../../../components/MedicineItem/MedicineItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../context/ShowContext";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../../context/MedicinesContext";
import AddWithPrint from "../../../../components/AddWithPrint/AddWithPrint";
const OldDispenses = () => {
  const [searchType, setSearchType] = useState("stdnum");
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [precisions, setPrecisions] = useState([]);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [patients, setPatients] = useState([]);
  const [medicines3, setMedicines3] = useState([]);
  const [disableSearchBar , setDisableSearchBar] = useState(false);
  const { fetchPrescriptions, loading, setLoading, error, setError } =
    useContext(MedicineContext);
  let { type } = useParams();
  const realType = type;
  const navigate = useNavigate();
  type =
    type === "chronic"
      ? "المزمن"
      : type === "emergency"
      ? "غير المزمن"
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
  useEffect(() => {
    const newPrescriptions = [...items];
    if (value.trim() === "") {
      setPrecisions(newPrescriptions);
      return;
    } else if (searchType === "stdnum") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.patient.nationalid.toString().startsWith(newValue);
      });
      setPrecisions(prescriptions);
    } else if (searchType === "id") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.id.toString().startsWith(newValue);
      });
      setPrecisions(prescriptions);
    } else if (searchType === "medicine") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.medicines.some((medicine) =>
          medicine.name.toLowerCase().startsWith(newValue)
        );
      });
      setPrecisions(prescriptions);
    } else if (searchType === "ar") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.medicines.some((medicine) =>
          medicine.arabicname.toLowerCase().startsWith(newValue)
        );
      });
      setPrecisions(prescriptions);
    }
  }, [value]);
  const isMount = useRef(false);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await fetchPrescriptions(realType);
        setItems(data);
        setPrecisions(data);
        if (data.length > 0) {
          setPatients((d) => {
            return data.map((precision) => precision.patient);
          });
          setMedicines3((d) => {
            return data.map((precision) => precision.medicines);
          })
        }
      } catch (error) {
        setError(error.message);
      }
      const time = setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    if (!isMount.current) {
      func();
      isMount.current = true;
    }
  }, [fetchPrescriptions]);
  useDocumentTitle(`عرض روشتات ${type}`);
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
      <LinkWithBack
        link="/stock/medicine-dispense"
        title={`عرض روشتات ${type}`}
      />
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          <Row>
            <Col>
              <Form.Group className={`mt-1`} controlId="search">
                <Form.Control
                  className={`${style.search} `}
                  type="text"
                  style={{ direction: "rtl" }}
                  disabled={disableSearchBar}
                  placeholder={
                    searchType === "stdnum"
                      ? "ادخل رقم الطالب القومي"
                      : searchType === "id"
                      ? "ادخل رقم الروشتة"
                      : searchType === "medicine"
                      ? "ادخل اسم الدواء"
                      : searchType === "ar"
                      ? "ادخل اسم الدواء باللغة العربية"
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
                <option value="stdnum">رقم الطالب القومي</option>
                <option value="id">رقم الروشتة</option>
                <option value="medicine">اسم الدواء</option>
                <option value="ar"> اسم الدواء باللغة العربية</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && precisions.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && precisions.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>رقم الروشتة</p>
                  <p>اسم المريض</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && precisions.length > 0 ? (
                precisions.map((precision, idx) => (
                  <MedicineItem
                    mainType="prescriptions"
                    type={realType}
                    className="mb-2"
                    key={precision.id}
                    id={precision.id}
                    idx={precision.id}
                    name={patients[idx].name}
                  />
                ))
              ) : !loading && !error && precisions.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint message={"اضافة روشتة جديدة"} link={"/stock/medicine-dispense/new-dispense?return=true"} />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default OldDispenses;
