import style from "./AllMedicines.module.css";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { useContext, useRef, useState } from "react";
import { ShowContext } from "../../../context/ShowContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import MedicineItem from "./../../../components/MedicineItem/MedicineItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MedicineContext } from "../../../context/MedicinesContext";
import AddWithPrint from "../../../components/AddWithPrint/AddWithPrint";
const AllMedicines = () => {
  const [searchType, setSearchType] = useState("medicine");
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");
  const { MedicineByCategories, loading, error, setError, setLoading } =
    useContext(MedicineContext);
  const [medicines2, setMedicines] = useState([]);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  let { type } = useParams();
  const [disableSearchBar , setDisableSearchBar] = useState(false);
  const navigate = useNavigate();
  type =
    type === "pills"
      ? "اقراص"
      : type === "ampoules"
      ? "امبولات"
      : type === "mix"
      ? "منوعات"
      : type === "all"
      ? "جميع الأنواع"
      : "";
  const id =
    type === "اقراص"
      ? 1
      : type === "امبولات"
      ? 2
      : type === "منوعات"
      ? "8"
      : type === "جميع الأنواع"
      ? "all"
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
    const func = async () => {
      setLoading(true);
      try {
        const data = await MedicineByCategories(id);
        setItems(data);
        setMedicines(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    if (!isMount.current) {
      func();
      isMount.current = true;
    }
  }, [id]);
  useEffect(() => {
    const getMedicines = items;
    if (value.trim() === "") {
      setMedicines(() => [...getMedicines]);
      return;
    } else {
      if (searchType === "id") {
        const newValue = value;
        const newMedicines = getMedicines.filter((medicine) => {
          return medicine.barcode.toString().startsWith(newValue);
        });
        setMedicines(newMedicines);
      } else if (searchType === "medicine") {
        const newValue = value.toLowerCase();
        const newMedicines = getMedicines.filter((medicine) => {
          return medicine.name.toLowerCase().startsWith(newValue);
        });
        setMedicines(newMedicines);
      }
      else if (searchType === "activeingredient") {
        const newValue = value;
        const newMedicines = getMedicines.filter((medicine) => {
          return medicine.activeingredient.startsWith(newValue);
        });
        setMedicines(newMedicines);
      } else if (searchType === "arabicname") {
        const newValue = value;
        const newMedicines = getMedicines.filter((medicine) => {
          return medicine.arabicname.startsWith(newValue);
        });
        setMedicines(newMedicines);
      }
    }
  }, [value]);
  useDocumentTitle(type);
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
      <LinkWithBack link="/stock/medicines" title={type} />
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
                    searchType === "id"
                      ? "ادخل كود الدواء"
                      : searchType === "medicine"
                      ? "ادخل اسم الدواء"
                            : searchType === "activeingredient" ? "ادخل المادة الفعالة"
                            : searchType === "arabicname" ? "ادخل اسم الدواء باللغة العربية" : ""
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
                <option value="id">كود الدواء</option>
                <option value="medicine">اسم الدواء</option>
                <option value="activeingredient">المادة الفعالة</option>
                <option value="arabicname">اسم الدواء باللغة العربية</option>

              </Form.Select>
            </Col>
          </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && medicines2.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && medicines2.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>كود الدواء</p>
                  <p>اسم الدواء</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && medicines2.length > 0 ? (
                medicines2.map((medicine) => (
                  <MedicineItem
                    className="mb-2"
                    key={medicine.barcode}
                    idx={medicine.barcode}
                    name={medicine.name}
                  />
                ))
              ) : !loading && !error && medicines2.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint
                message={"اضافة دواء جديد"}
                link={"/stock/medicines/add-medicine?return=true"}
              />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default AllMedicines;
