import style from "./Dispense.module.css";
import { createPortal } from "react-dom";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import Input from "../../../components/input/Input";
import { useFormik } from "formik";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { LiaSchoolSolid } from "react-icons/lia";
import { GrPowerReset } from "react-icons/gr";
import { AiFillPhone, AiOutlineNumber } from "react-icons/ai";
import { FaVirusCovid } from "react-icons/fa6";
import { GiEgyptianSphinx, GiMedicinePills, GiPill } from "react-icons/gi";
import * as yup from "yup";
import ButtonSubmit from "../../../components/ButtonSubmit";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import Select from "../../../components/Select/Select";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MediSelected from "./../../../components/MediSelected/MediSelected";
import { useContext } from "react";
import { ShowContext } from "../../../context/ShowContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import InputAutoComplete2 from "../../../components/InputAutoComplete2/InputAutoComplete2";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../context/MedicinesContext";
import IconV2 from "../../../components/IconV2/IconV2";
import { BiBarcodeReader, BiReset } from "react-icons/bi";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
const Dispense = () => {
  const { nameOrCode, medicineList, handleNameOrCode, loading, setLoading } =
    useContext(MedicineContext);
  const {
    items,
    getMedicines,
    fetchPatients,
    addNewPrescription,
    FetchPrescriptionInfo,
    updatePrescription,
  } = useContext(MedicineContext);
  const location = useLocation();
  const { id } = useParams();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [realPatients, setRealPatients] = useState([]);
  const naviate = useNavigate();
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const medicineRef = useRef(null);
  const [error, setError] = useState(null);
  const [change, setChange] = useState(false);
  const [change2, setChange2] = useState(false);
  const falseChange = () => {
    setChange(false);
  };
  const falseChange2 = () => {
    setChange2(false);
  };

  const [mode, setMode] = useState("");
  const [currentId, setId] = useState("");
  const [name, setName] = useState("");
  const [stds, setStds] = useState([]);
  const [stdd, setStdd] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [allValues, setAllValues] = useState({});
  const [quantity, setQuantity] = useState("");
  const [newItems, setNewItems] = useState([]);
  const [show, setShow] = useState(false);
  const [medicines, setMedicines] = useState(
    sessionStorage.getItem(`medicines-${location.pathname}`)
      ? JSON.parse(sessionStorage.getItem(`medicines-${location.pathname}`))
      : []
  );
  const handleClose = () => {
    setShow(false);
    setName("");
    setQuantity("");
  };
  const handleShow = () => {
    setShow(true);
    setError(null);
  };
  useDocumentTitle(
    location.pathname.includes("edit")
      ? "تعديل معلومات روشتة قديمة"
      : "إضافة روشتة جديدة"
  );
  console.log(loading,loading2 , loading3 , loadingPatients)
  const formik = useFormik({
    validateOnMount: true,
    initialValues: location.pathname.includes("edit")
      ? {
          stdname: "",
          phone: "",
          national: "",
          collage: "",
          ["university-year"]: "",
          prescriptionNumber: "",
          prescriptionType: "",
          disease: "",
        }
      : {
          stdname: sessionStorage.getItem(`stdname-${location.pathname}`) || "",
          phone: sessionStorage.getItem(`phone-${location.pathname}`) || "",
          national:
            sessionStorage.getItem(`national-${location.pathname}`) || "",
          collage: sessionStorage.getItem(`collage-${location.pathname}`) || "",
          ["university-year"]:
            sessionStorage.getItem(`university-year-${location.pathname}`) ||
            "",
          prescriptionNumber:
            sessionStorage.getItem(`prescriptionNumber-${location.pathname}`) ||
            "",
          prescriptionType:
            sessionStorage.getItem(`prescriptionType-${location.pathname}`) ||
            "",
          disease: sessionStorage.getItem(`disease-${location.pathname}`) || "",
        },
    validationSchema: yup.object().shape({
      stdname: yup.string().required("الرجاء ادخال إسم الطالب"),
      phone: yup.string().required("الرجاء ادخال رقم الهاتف"),
      national: yup
        .string()
        .required("الرجاء ادخال رقم القومي")
        .test(
          "maxDigits",
          "الرجاء ادخال رقم قومي صحيح",
          (value) => value.length === 14
        ),
      collage: yup.string().required("الرجاء ادخال اسم الكلية"),
      ["university-year"]: yup
        .string()
        .required("الرجاء ادخال الفرقة الدراسية"),
      prescriptionNumber: yup.string().required("الرجاء ادخال رقم الروشتة"),
      prescriptionType: yup.string().required("الرجاء اختيار نوع الروشتة"),
      disease: yup.string().required("الرجاء ادخال التشخيص"),
    }),
    onSubmit: async (values) => {
      let id = values.prescriptionNumber;
      let type = values.prescriptionType;
      setLoading2(true);
      values = {
        ...values,
        medicine: medicineList.filter((medi) =>
          medicines.some((medicine) => medicine.name === medi.name)
        ),
        patient: realPatients.find((el) => el.name === values.stdname),
        prescriptionType:
          values.prescriptionType === "chronic"
            ? { id: 1, name: "مزمن" }
            : { id: 2, name: "طوارئ" },
      };
      let response;
      if (location.pathname.includes("edit")) {
        response = await updatePrescription(values);
      } else {
        response = await addNewPrescription(values);
      }
      if (response.ok) {
        formik.resetForm();
        setMedicines([]);
        sessionStorage.setItem(`medicines-${window.location.pathname}`, "");
        sessionStorage.setItem(`stdname-${window.location.pathname}`, "");
        sessionStorage.setItem(`phone-${window.location.pathname}`, "");
        sessionStorage.setItem(`national-${window.location.pathname}`, "");
        sessionStorage.setItem(`collage-${window.location.pathname}`, "");
        sessionStorage.setItem(
          `university-year-${window.location.pathname}`,
          ""
        );
        sessionStorage.setItem(
          `prescriptionNumber-${window.location.pathname}`,
          ""
        );
        sessionStorage.setItem(
          `prescriptionType-${window.location.pathname}`,
          ""
        );
        sessionStorage.setItem(`disease-${window.location.pathname}`, "");
        formik.setValues({
          stdname: "",
          phone: "",
          national: "",
          collage: "",
          ["university-year"]: "",
          prescriptionNumber: "",
          prescriptionType: "",
          disease: "",
        });
        toast.success(
          location.pathname.includes("edit")
            ? "تم تعديل الروشتة بنجاح"
            : "تم اضافة الروشتة بنجاح"
        );
      }
      setLoading2(false);
      naviate(
        `/stock/medicine-dispense/old-dispenses/${
          type === "accurate" ? "emergency" : "chronic"
        }/${id}`
      );
    },
  });
  const handleMedicines = (e, name, quantity) => {
    e.preventDefault();
    const alreadyExists = medicines.find((medi) => medi.name === name);
    const found = items.find((item) => item === name.trim());
    if (found && !alreadyExists) {
      const getMedi = [
        ...medicines,
        {
          id: new Date().getTime(),
          name: name,
          quantity,
        },
      ];
      setMedicines(getMedi);
      sessionStorage.setItem(
        `medicines-${window.location.pathname}`,
        JSON.stringify(getMedi)
      );
      setError(null);
      handleClose();
    } else if (!found) {
      setError("الرجاء التأكد من ادخال اسم الدواء بشكل صحيح");
    } else if (alreadyExists) {
      setError("الدواء موجود بالفعل في الطلبية");
    }
  };

  const handleDelete = (id) => {
    const newMedicine = medicines.filter((medi) => medi.id !== id);
    setMedicines(newMedicine);
    sessionStorage.setItem(
      `medicines-${window.location.pathname}`,
      JSON.stringify(newMedicine)
    );
  };
  const handleEdit = (id) => {
    const medicine = medicines.find((medi) => medi.id === id);
    setName(medicine.name);
    setQuantity(medicine.quantity);
    handleShow();
  };
  const saveChanges = (id) => {
    const newMedicine = medicines.map((medi) => {
      if (medi.id === id) {
        return { ...medi, name, quantity };
      }
      return medi;
    });
    setMedicines(newMedicine);
    sessionStorage.setItem(
      `medicines-${window.location.pathname}`,
      JSON.stringify(newMedicine)
    );

    handleClose();
  };
  const isMounted = useRef(true);
  useEffect(() => {
    const getPatients = async () => {
      setLoadingPatients(true);
      try {
        const response = await fetchPatients();
        setRealPatients(response);
        const transformedResponse = response.map((el) => {
          return {
            national: el.nationalid,
            phone: el.phone_number,
            stdID: el.student_id,
            gender: el.gender,
            name: el.name,
            type: el.chronic,
            ["university-year"]: el.level,
            collage: el.collegeName,
            disease: el.disease.map((disease) => disease.name).join("-"),
          };
        });
        setStds(transformedResponse);
        setNewItems(transformedResponse);
      } catch (error) {
        setError(error.message);
      }
      setLoadingPatients(false);
	  setLoading(false);
    };
    if (isMounted.current) {
      getPatients();
      isMounted.current = false;
    }
  }, [fetchPatients]);
  useEffect(() => {
    if (newItems.length > 0) {
      addStds();
    }
  }, [newItems]);

  const addStds = () => {
    if (newItems.length > 0) {
      const newStdd = [...newItems];
      const filteredStdd = newStdd.filter((el) =>
        el.name.startsWith(formik.values.stdname.trim())
      );
      setStdd(newStdd);
      setAllValues(filteredStdd);
      setStds(filteredStdd.map((el) => el.name));
    }
  };
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const func = async () => {
        try {
          setLoading3(true);
          const data = await FetchPrescriptionInfo(id);
          formik.setValues({
            stdname: data.patient.name,
            phone: data.patient.phone_number,
            national: data.patient.nationalid,
            collage: data.patient.collegeName,
            ["university-year"]: data.patient.level,
            prescriptionNumber: data.id,
            prescriptionType:
              data.prsPrescriptionCategory.name === "طوارئ"
                ? "accurate"
                : "chronic",
            disease: data.diagnosis,
          });
          const getMedicines = [...data.medicines];
          if (getMedicines.length > 0) {
            setMedicines(() => {
              return getMedicines.map((e) => {
                return {
                  ...medicines,
                  id: e.barcode,
                  name: e.name,
                  quantity: "-",
                };
              });
            });
          }
        } catch (error) {
          setError(error.message);
        }
        setLoading3(false);
      };
      func();
    }
  }, [FetchPrescriptionInfo]);
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
      className={`${style.dispense} d-flex flex-column px-sm-5 px-0 pb-4`}
    >
      {spinner && spinnerElement}
      <LinkWithBack
        link={"/stock/medicine-dispense"}
        title={
          location.pathname.includes("edit")
            ? "تعديل معلومات روشتة قديمة"
            : "إضافة روشتة جديدة"
        }
      />
      {loading || loading3 || loadingPatients ? (
        <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
          جاري التحميل...
        </div>
      ) : !loading && !error && !loading3 && !loadingPatients ? (
        <Form autoSave={"on"} onSubmit={formik.handleSubmit}>
          <Row lg="3" xs="1" md="2">
            <Col>
              <InputAutoComplete2
                error={formik.errors.stdname}
                touched={formik.touched.stdname}
                onBlur={formik.handleBlur}
                value={formik.values.stdname}
                onChange={(e) => {
                  formik.handleChange(e);
                  setChange2(true);
                }}
                className="text-end"
                width={"100%"}
                label="إسم الطالب"
                type="text"
                id="stdname"
                name="stdname"
                items={stds}
                allValues={allValues}
                linkedAttr={[
                  "phone",
                  "national",
                  "collage",
                  "university-year",
                  "level",
                  "disease",
                ]}
                dropFunction={addStds}
                direction={"ltr"}
                icon={<FaUserAlt />}
                linkAdded={"/patients/add-new-patient?return=true"}
                message={"الطالب غير مضاف , هل تريد اضافته؟"}
                setValue={formik.setFieldValue}
                formik={true}
                change={change2}
                falseChange={falseChange2}
              />
              <Input
                error={formik.errors.national}
                onBlur={formik.handleBlur}
                touched={formik.touched.national}
                value={formik.values.national}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 text-end"
                label="رقم القومي"
                type="number"
                id="national"
                name="national"
                icon={<GiEgyptianSphinx />}
              />
              <Input
                className="text-end mt-2"
                error={formik.errors.collage}
                touched={formik.touched.collage}
                onBlur={formik.handleBlur}
                value={formik.values.collage}
                onChange={formik.handleChange}
                width={"100%"}
                label="الكلية"
                type="text"
                id="collage"
                name="collage"
                icon={<IoMdSchool />}
              />
              <Input
                className="text-end mt-2"
                error={formik.errors["university-year"]}
                touched={formik.touched["university-year"]}
                onBlur={formik.handleBlur}
                value={formik.values["university-year"]}
                onChange={formik.handleChange}
                width={"100%"}
                label="الفرقة الدراسية"
                type="text"
                id="university-year"
                name="university-year"
                icon={<LiaSchoolSolid />}
              />
              <Input
                error={formik.errors.phone}
                onBlur={formik.handleBlur}
                touched={formik.touched.phone}
                value={formik.values.phone}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 text-end"
                label="رقم الهاتف"
                type="text"
                id="phone"
                name="phone"
                icon={<AiFillPhone />}
              />
            </Col>
            <Col className="d-flex flex-column justify-content-between">
              <div className="d-flex flex-column">
                <Input
                  className="text-end mt-2 mt-md-0"
                  error={formik.errors.prescriptionNumber}
                  touched={formik.touched.prescriptionNumber}
                  onBlur={formik.handleBlur}
                  value={formik.values.prescriptionNumber}
                  onChange={formik.handleChange}
                  width={"100%"}
                  label="رقم الروشتة"
                  type="number"
                  id="prescriptionNumber"
                  name="prescriptionNumber"
                  icon={<GiMedicinePills />}
                />
                <Input
                  className="text-end mt-2"
                  error={formik.errors.disease}
                  touched={formik.touched.disease}
                  onBlur={formik.handleBlur}
                  value={formik.values.disease}
                  onChange={formik.handleChange}
                  width={"100%"}
                  label="التشخيص"
                  type="text"
                  id="disease"
                  name="disease"
                  icon={<FaVirusCovid />}
                />
                <div className={`${style.mediTable} overflow-y-scroll mt-2`}>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الدواء</th>
                        <th>الكمية</th>
                        <th>الأيقونات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.length
                        ? medicines.map((medi, index) => (
                            <MediSelected
                              setId={setId}
                              setMode={setMode}
                              key={medi.id}
                              name={medi.name}
                              quantity={medi.quantity}
                              id={medi.id}
                              idx={index + 1}
                              handleDelete={handleDelete}
                              handleEdit={handleEdit}
                            />
                          ))
                        : null}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
            <Col className="">
              <Select
                className="mt-2"
                label="نوع الروشتة"
                id="prescriptionType"
                width={"100%"}
                name="prescriptionType"
                value={formik.values.prescriptionType}
                error={formik.errors.prescriptionType}
                touched={formik.touched.prescriptionType}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              >
                <option value="">اختر نوع الروشتة</option>
                <option value="chronic">مزمن</option>
                <option value="accurate">طوارئ</option>
              </Select>
              <div
                className={`${style.buttonandsvg} overflow-hidden mt-2 mt-lg-2`}
              >
                <div
                  className=""
                  style={{ width: "fit-content", margin: "auto" }}
                >
                  <div
                    className="btnnn text-center mt-4 mt-lg-0 m-auto"
                    style={{ width: "140px" }}
                  >
                    <img src="/patient2.svg" alt="" />
                  </div>
                </div>
                <div className="btnnn d-flex gap-2 justify-content-lg-end justify-content-center w-100 mt-4 my-lg-0 mt-lg-2">
                  <Button
                    className="btn-main w-50"
                    onClick={() => {
                      handleShow();
                      setMode("add");
                    }}
                  >
                    إضافة دواء
                  </Button>
                  <ButtonSubmit
                    disabled={!formik.isValid || !medicines.length || loading2}
                    className="btn-main w-50"
                  >
                    {loading2
                      ? "جاري التحميل..."
                      : location.pathname.includes("edit")
                      ? "تعديل الروشتة"
                      : "إضافة الروشتة"}
                  </ButtonSubmit>
                  {location.search.includes("return") && (
                    <Button
                      onClick={() => naviate(-1, { replace: true })}
                      className="btn-main w-100 fontSize12px"
                    >
                      الرجوع الى العملية السابقة
                    </Button>
                  )}
                  <Button
                    id="not-clickable"
                    className="btn-main"
                    onClick={() => {
                      sessionStorage.setItem(
                        `medicines-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `stdname-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `phone-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `national-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `collage-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `university-year-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `prescriptionNumber-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `prescriptionType-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `disease-${window.location.pathname}`,
                        ""
                      );
                      setMedicines([]);
                      formik.resetForm();
                      formik.setValues({
                        stdname: "",
                        phone: "",
                        national: "",
                        collage: "",
                        ["university-year"]: "",
                        prescriptionNumber: "",
                        prescriptionType: "",
                        disease: "",
                      });
                    }}
                  >
                    <BiReset />
                  </Button>
                  <Tooltip
                    anchorSelect="#not-clickable"
                    clickable={true}
                    style={{ fontSize: "12px" }}
                  >
                    اعادة تعيين البيانات
                  </Tooltip>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      ) : error ? (
        <p className="text-center p-0 m-0 mt-5 fw-bold">
          عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
        </p>
      ) : null}
      {createPortal(
        <Modal show={show} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>
              {mode === "add"
                ? "اختر اسم الدواء المراد اضافته"
                : "تعديل معلومات الدواء"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => handleMedicines(e, name, quantity)}>
              <Row>
                <Col>
                  <div className="d-flex gap-2">
                    <InputAutoComplete2
                      ref={medicineRef}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setChange(true);
                        setError(null);
                      }}
                      className="text-end "
                      width={"100%"}
                      label={
                        nameOrCode === "name" ? "اسم الدواء" : "كود الدواء"
                      }
                      type="text"
                      id="medicine"
                      name="medicine"
                      items={items.sort()}
                      dropFunction={() => getMedicines(name)}
                      direction={"ltr"}
                      icon={
                        nameOrCode === "name" ? (
                          <GiMedicinePills />
                        ) : (
                          <BiBarcodeReader />
                        )
                      }
                      linkAdded={"/stock/medicines/add-medicine?return=true"}
                      message={"الدواء غير موجود , هل تريد اضافته؟"}
                      setValue={setName}
                      formik={false}
                      change={change}
                      error={error}
                      falseChange={falseChange}
                    />
                    <IconV2
                      id="selectType"
                      icon={
                        nameOrCode === "name" ? <BiBarcodeReader /> : <GiPill />
                      }
                      onClick={() => {
                        handleNameOrCode();
                        setName("");
                        medicineRef.current.focus();
                      }}
                    />
                    <Tooltip
                      anchorSelect="#selectType"
                      clickable={true}
                      place="bottom"
                      style={{ fontSize: "12px", zIndex: 500 }}
                    >
                      اختر طريقة البحث
                    </Tooltip>
                  </div>
                  <p className={"descriptiveP"}>
                    يمكنك البحث باستعمال اسم الدواء او الباركود*
                  </p>
                </Col>

                <Col>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="الكمية"
                    type="number"
                    id="quantity"
                    name="quantity"
                    icon={<AiOutlineNumber />}
                  />
                </Col>
              </Row>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                {mode === "edit" ? (
                  <Button
                    variant="danger"
                    onClick={() => saveChanges(currentId)}
                  >
                    حفظ التعديلات
                  </Button>
                ) : (
                  <ButtonSubmit
                    disabled={!name.trim() || !quantity.trim()}
                    className="btn-main"
                    variant="primary"
                  >
                    حفظ التغييرات
                  </ButtonSubmit>
                )}
                <Button variant="secondary" onClick={handleClose}>
                  إغلاق
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>,
        document.getElementById("modal")
      )}
    </motion.div>
  );
};

export default Dispense;
