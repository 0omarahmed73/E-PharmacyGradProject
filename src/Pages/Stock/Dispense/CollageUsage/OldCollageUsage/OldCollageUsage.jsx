import style from "./OldCollageUsage.module.css";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import MedicineItem from "./../../../../../components/MedicineItem/MedicineItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../../context/ShowContext";
import LinkWithBack from "../../../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../../../context/MedicinesContext";
import AddWithPrint from "../../../../../components/AddWithPrint/AddWithPrint";
const OldCollageUsage = () => {
  const [searchType, setSearchType] = useState("reqnum");
  const [value, setValue] = useState("");
  const [fetched, setFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState([
    [
      {
        id: 0,
        date: "",
        collegeName: "",
        collegeUseageMedicines: [
          {
            id: 0,
            amount: 0,
            inventory: {
              id: 0,
              amount: 0,
              orderMedicine: {
                id: 0,
                amount: 0,
                price: 0,
                expirydate: " ",
                medicine: {
                  id: 0,
                  barcode: 0,
                  name: "0",
                  arabicname: "0",
                  dosageform: null,
                  strength: " ",
                  activeingredient: " ",
                  manufacturer: " ",
                  alertamount: 0,
                  alertexpired: 0,
                  unit: "h",
                  medicineCategory: {
                    id: 1,
                    name: "اقراص",
                  },
                },
              },
            },
          },
        ],
        totalPrice: 42642.0,
      },
    ],
  ]);
  const [precisions, setPrecisions] = useState([]);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [patients, setPatients] = useState([]);
  const [medicines3, setMedicines3] = useState([]);
  const [disableSearchBar, setDisableSearchBar] = useState(false);
  const { fetchCollageUsage, loading, setLoading, error, setError } =
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
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const [originalData, setOriginalData] = useState([]);
  useEffect(() => {
    if (fetched) {
      if (value.trim() === "") {
        setFetchedData(originalData);
        return;
      } else if (searchType === "reqnum") {
        const newValue = value.toLowerCase();
        // Filter the original data, not fetchedData
        const prescriptions = originalData.filter((prescription) => {
          return prescription.id.toString().startsWith(newValue);
        });
        setFetchedData(prescriptions);
      } else if (searchType === "collegeName") {
        const newValue = value.toLowerCase();
        const prescriptions = originalData.filter((prescription) => {
          return prescription.collegeName.toLowerCase().startsWith(newValue);
        });
        setFetchedData(prescriptions);
      } else if (searchType === "medicine") {
        const newValue = value.toLowerCase();
        const prescriptions = originalData.filter((prescription) => {
          return prescription.collegeUseageMedicines.some((medicine) =>
            medicine.inventory.orderMedicine.medicine.name
              .toLowerCase()
              .startsWith(newValue)
          );
        });
        setFetchedData(prescriptions);
      } else if (searchType === "ar") {
        const newValue = value.toLowerCase();
        const prescriptions = originalData.filter((prescription) => {
          return prescription.collegeUseageMedicines.some((medicine) =>
            medicine.inventory.orderMedicine.medicine.arabicname
              .toLowerCase()
              .startsWith(newValue)
          );
        });
        setFetchedData(prescriptions);
      }
    }
  }, [value, fetched, originalData]);
  const isMount = useRef(false);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await fetchCollageUsage();
        setFetchedData(data);
        setOriginalData(data);
        setFetched(true);
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
  }, [fetchCollageUsage]);
  useDocumentTitle(`عرض الأذونات القديمة`);
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
        link="/stock/medicine-dispense/collage-usage"
        title={`عرض الأذونات القديمة`}
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
                    searchType === "reqnum"
                      ? "ادخل رقم الإذن"
                      : searchType === "collageName"
                      ? "ادخل اسم الكلية"
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
                <option value="reqnum">رقم الإذن</option>
                <option value="collageName">اسم الكلية</option>
                <option value="medicine">اسم الدواء</option>
                <option value="ar"> اسم الدواء باللغة العربية</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && !fetched ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && fetched && fetchedData.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>رقم الإذن</p>
                  <p>اسم الكلية</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && fetched && fetchedData.length > 0 ? (
                fetchedData.map((precision, idx) => (
                  <MedicineItem
                    mainType="collage-usage"
                    type={realType}
                    className="mb-2"
                    key={precision.id}
                    id={precision.id}
                    idx={precision.id}
                    name={precision.collegeName}
                  />
                ))
              ) : !loading &&
                !error &&
                (!fetched || fetchedData.length == 0) ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint
                message={"اضافة إذن جديد"}
                link={
                  "/stock/medicine-dispense/collage-usage/add-new-collage-usage?return=true"
                }
              />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default OldCollageUsage;
