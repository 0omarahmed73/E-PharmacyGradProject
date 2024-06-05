import style from "./Usage.module.css";
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
const Usage = () => {
  const [searchType, setSearchType] = useState("stdnum");
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [precisions, setPrecisions] = useState([]);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [patients, setPatients] = useState([]);
  const [medicines3, setMedicines3] = useState([]);
  const [mix, setMix] = useState({
    prescription: [],
    patients: [],
    medicines: [],
  });
  const [disableSearchBar , setDisableSearchBar] = useState(false);
  const isMount = useRef(false);
  const { fetchUsage, loading, setLoading, error, setError } =
    useContext(MedicineContext);
  const navigate = useNavigate();
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
    const newPrescriptions = [...items];
    if (value.trim() === "") {
      setMix({
        id: items.map((precision) => precision.id),
        prescription: items.map((precision) => precision.prescription),
        medicines: items.flatMap((precision) => precision.useageMedicines),
        patients: items.map((precision) => precision.prescription.patient),
      });
      return;
    } else if (searchType === "stdnum") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.prescription.patient.nationalid
          .toString()
          .startsWith(newValue);
      });
      setMix({
        id: prescriptions.map((precision) => precision.id),
        prescription: prescriptions.map((precision) => precision.prescription),
        medicines: prescriptions.flatMap(
          (precision) => precision.useageMedicines
        ),
        patients: prescriptions.map(
          (precision) => precision.prescription.patient
        ),
      });
    } else if (searchType === "id") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.prescription.id.toString().startsWith(newValue);
      });
      setMix({
        id: prescriptions.map((precision) => precision.id),
        prescription: prescriptions.map((precision) => precision.prescription),
        medicines: prescriptions.flatMap(
          (precision) => precision.useageMedicines
        ),
        patients: prescriptions.map(
          (precision) => precision.prescription.patient
        ),
      });
    } else if (searchType === "medicine") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.useageMedicines.some((medicine) =>
          medicine.medicine.name.toLowerCase().startsWith(newValue)
        );
      });
      setMix({
        id: prescriptions.map((precision) => precision.id),
        prescription: prescriptions.map((precision) => precision.prescription),
        medicines: prescriptions.flatMap(
          (precision) => precision.useageMedicines
        ),
        patients: prescriptions.map(
          (precision) => precision.prescription.patient
        ),
      });
    }
    else if (searchType === "ar") {
      const newValue = value.toLowerCase();
      const prescriptions = newPrescriptions.filter((prescription) => {
        return prescription.useageMedicines.some((medicine) =>
          medicine.medicine.arabicname.toLowerCase().startsWith(newValue)
        );
      });
      setMix({
        id: prescriptions.map((precision) => precision.id),
        prescription: prescriptions.map((precision) => precision.prescription),
        medicines: prescriptions.flatMap(
          (precision) => precision.useageMedicines
        ),
        patients: prescriptions.map(
          (precision) => precision.prescription.patient
        ),
      });
    }
  }, [value]);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await fetchUsage();
        setItems(data);
        if (data.length > 0) {
          setPrecisions(data.map((precision) => precision.prescription));
          setPatients(data.map((precision) => precision.prescription.patient));
          setMedicines3(data.map((precision) => precision.medicines));
          setMix({
            id: data.map((precision) => precision.id),
            prescription: data.map((precision) => precision.prescription),
            medicines: data.flatMap((precision) => precision.useageMedicines),
            patients: data.map((precision) => precision.prescription.patient),
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (!isMount.current) {
      func();
      isMount.current = true;
    }
  }, [fetchUsage]);
  useDocumentTitle(`الروشتات المصروفة`);
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
        title={`الروشتات المصروفة`}
      />
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
              {loading && !error && mix.prescription.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && mix.prescription.length > 0 ? (
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
              {!error && mix.prescription.length > 0 ? (
                mix.prescription.map((precision, idx) => (
                  <MedicineItem
                    mainType="usage"
                    className="mb-2"
                    key={idx}
                    idx={precision.id}
                    id={mix.id[idx]}
                    name={mix.patients[idx].name}
                  />
                ))
              ) : !loading && !error && mix.prescription.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint
                message={"اضافة روشتة جديدة"}
                link={"/stock/medicine-dispense/new-dispense?return=true"}
              />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default Usage;
