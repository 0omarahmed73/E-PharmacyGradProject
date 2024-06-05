import { useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import style from "./AddNewPatient.module.css";
import { useFormik } from "formik";
import { FaUniversity } from "react-icons/fa";
import { AiFillPhone } from "react-icons/ai";
import { SiLevelsdotfyi } from "react-icons/si";
import { GiEgyptianSphinx } from "react-icons/gi";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import { ShowContext } from "../../../../context/ShowContext";
import { AuthContext } from "../../../../context/AuthContext";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import ButtonSubmit from "../../../../components/ButtonSubmit";
import Input from "../../../../components/input/Input";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import Select from "../../../../components/Select/Select";
import { PiGenderIntersexBold, PiStudentFill } from "react-icons/pi";
import { FaVirusCovid } from "react-icons/fa6";
import { GoNumber } from "react-icons/go";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MedicineContext } from "../../../../context/MedicinesContext";
import IconV2 from "../../../../components/IconV2/IconV2";
import { TbTruckDelivery } from "react-icons/tb";
import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
const AddNewPatient = () => {
  const [modelSupplier, setModelSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const [info, setInfo] = useState([]);
  const location = useLocation();
  const naviate = useNavigate();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const { loading, setLoading } = useContext(AuthContext);
  const {
    fetchDiseases,
    addNewPatient,
    FetchPatientInfo,
    error,
    setError,
    addNewDisease,
    loading: loading2,
    setLoading: setLoading2,
    updatePatient,
  } = useContext(MedicineContext);
  const [diseases, setDiseases] = useState([]);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useDocumentTitle(
    location.pathname.includes("edit")
      ? "تعديل معلومات المريض"
      : "اضافة مريض جديد"
  );
  const handleClose = () => {
    setModelSupplier(false);
    setNewSupplier("");
  };
  const handleShow = () => {
    setModelSupplier(false);
  };

  const formik = useFormik({
    validateOnMount: true,
    initialValues: location.pathname.includes("edit")
      ? {
          type: "",
          company: "",
          code: "",
          quantity: "",
          days: "",
          en: "",
          ar: "",
          strength: "",
          activeingredient: "",
          mixType: "",
        }
      : {
          level:
            sessionStorage.getItem(`level-${window.location.pathname}`) || "",
          name:
            sessionStorage.getItem(`name-${window.location.pathname}`) || "",
          collage:
            sessionStorage.getItem(`collage-${window.location.pathname}`) || "",
          phone:
            sessionStorage.getItem(`phone-${window.location.pathname}`) || "",
          national:
            sessionStorage.getItem(`national-${window.location.pathname}`) ||
            "",
          type:
            sessionStorage.getItem(`type-${window.location.pathname}`) ||
            "true",
          gender:
            sessionStorage.getItem(`gender-${window.location.pathname}`) || "",
          diseases:
            JSON.parse(
              sessionStorage.getItem(`diseases-${window.location.pathname}`)
            ) || [],
          stdID:
            sessionStorage.getItem(`stdID-${window.location.pathname}`) || "",
          age: sessionStorage.getItem(`age-${window.location.pathname}`) || "",
        },
    validationSchema: yup.object().shape({
      level: yup.string().required("الرجاء ادخال الفرقة"),
      collage: yup.string().required("الرجاء ادخال اسم الكلية"),
      name: yup.string().required("الرجاء ادخال الاسم"),
      national: yup
        .string()
        .required("الرجاء ادخال رقم القومي")
        .test(
          "maxDigits",
          "الرجاء ادخال رقم قومي صحيح",
          (value) => value.length === 14
        ),
      gender: yup.string().required("الرجاء ادخال نوع المريض"),
    }),
    onSubmit: async (values) => {
      const newDiseases = diseases.filter((disease) =>
        values.diseases.includes(disease.name)
      );
      values = {
        ...values,
        diseases: newDiseases,
      };
      setLoading(true);
      let response;
      if (location.pathname.includes("edit")) {
        response = await updatePatient(values);
      } else {
        response = await addNewPatient(values);
      }
      if (response.ok) {
        sessionStorage.removeItem(`level-${window.location.pathname}`);
        sessionStorage.removeItem(`name-${window.location.pathname}`);
        sessionStorage.removeItem(`collage-${window.location.pathname}`);
        sessionStorage.removeItem(`phone-${window.location.pathname}`);
        sessionStorage.removeItem(`national-${window.location.pathname}`);
        sessionStorage.removeItem(`type-${window.location.pathname}`);
        sessionStorage.removeItem(`gender-${window.location.pathname}`);
        sessionStorage.removeItem(`diseases-${window.location.pathname}`);
        sessionStorage.removeItem(`stdID-${window.location.pathname}`);
        sessionStorage.removeItem(`age-${window.location.pathname}`);
        formik.resetForm();
        formik.setValues({
          level: "",
          name: "",
          collage: "",
          phone: "",
          national: "",
          type: "true",
          gender: "",
          diseases: [],
          stdID: "",
          age: "",
        });
        toast.success(
          location.pathname.includes("edit")
            ? "تم تعديل البيانات بنجاح"
            : "تم إضافة المريض بنجاح"
        );
      }
      setLoading(false);
    },
  });
  const handleSuppliers = async (e) => {
    if (newSupplier.trim()) {
      e.preventDefault();
      setLoading(true);
      const response = await addNewDisease(newSupplier);
      if (response.ok) {
        toast.success("تم اضافة المرض بنجاح");
        fetchDiseases();
        setDiseases((prev) => [...prev, { name: newSupplier }]);
        setModelSupplier(false);
        setNewSupplier("");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    const func = async () => {
      setLoading2(true);
      const data = await fetchDiseases();
      setDiseases(data);
      setLoading2(false);
    };
    func();
  }, [fetchDiseases]);
  useEffect(() => {
    if (formik.values.type === "false") {
      formik.setFieldValue("diseases", []);
    }
  }, [formik.values.type]);
  const { id } = useParams();
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const func = async () => {
        try {
          setLoading2(true);
          const patient = await FetchPatientInfo(id);
          setInfo(patient);
          formik.setValues({
            national: patient.nationalid,
            phone: patient.phone_number,
            stdID: patient.student_id,
            gender: patient.gender,
            name: patient.name,
            type: patient.chronic,
            level: patient.level,
            collage: patient.collegeName,
            diseases: patient.disease.map((disease) => disease.name),
            age: patient.age,
          });
        } catch (error) {
          setError(error.message);
        }
        setLoading2(false);
      };
      func();
    }
  }, [FetchPatientInfo]);

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
      className={`${style.addAccount} d-flex flex-column px-sm-5 px-0`}
    >
      {spinner && spinnerElement}
      <LinkWithBack
        link="/patients"
        title={
          location.pathname.includes("edit")
            ? "تعديل معلومات المريض"
            : "اضافة مريض جديد"
        }
      />
      {loading2 ? (
        <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
          جاري التحميل...
        </div>
      ) : !loading2 && !error ? (
        <Form onSubmit={formik.handleSubmit} className="pb-4">
          <Row lg="2" xs="1" md="2">
            <Col>
              <Input
                className="text-end"
                error={formik.errors.name}
                touched={formik.touched.name}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                onChange={formik.handleChange}
                width={"100%"}
                label="إسم الطالب"
                type="text"
                id="name"
                name="name"
                icon={<PiStudentFill />}
              />
              <Select
                error={formik.errors.collage}
                onBlur={formik.handleBlur}
                touched={formik.touched.collage}
                value={formik.values.collage}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2"
                label="اسم الكلية"
                id="collage"
                name="collage"
                icon={<FaUniversity />}
              >
                <option value="">اختر الكلية</option>
                <option value="كلية الهندسة بشبرا">كلية الهندسة بشبرا</option>
                <option value="كلية الهندسة ببنها">كلية الهندسة ببنها</option>
                <option value="كلية الحاسبات والذكاء الإصطناعي">
                  كلية الحاسبات والذكاء الإصطناعي
                </option>
                <option value="كلية العلوم">كلية العلوم</option>
                <option value="كلية الزراعة">كلية الزراعة</option>
                <option value="كلية الفنون التطبيقية">
                  كلية الفنون التطبيقية
                </option>
                <option value="كلية التجارة">كلية التجارة</option>
                <option value="كلية التربية">كلية التربية</option>
                <option value="كلية التربية النوعية">
                  كلية التربية النوعية
                </option>
                <option value="كلية التربية الرياضية">
                  كلية التربية الرياضية
                </option>
                <option value="كلية الحقوق">كلية الحقوق</option>
                <option value="كلية الآداب">كلية الآداب</option>
                <option value="كلية الطب البشري">كلية الطب البشري</option>
                <option value="كلية الطب البيطري">كلية الطب البيطري</option>
                <option value="كلية التمريض">كلية التمريض</option>
                <option value="كلية العلاج الطبيعي">كلية العلاج الطبيعي</option>
              </Select>
              <Select
                error={formik.errors.level}
                onBlur={formik.handleBlur}
                touched={formik.touched.level}
                value={formik.values.level}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2"
                label="الفرقة"
                id="level"
                name="level"
                icon={<SiLevelsdotfyi />}
              >
                <option value="">اختر الفرقة</option>
                <option value="الفرقة الأولى">الفرقة الأولى</option>
                <option value="الفرقة الثانية">الفرقة الثانية</option>
                <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                <option value="الفرقة الخامسة">الفرقة الخامسة</option>
                <option value="الفرقة السادسة">الفرقة السادسة</option>
                <option value="الفرقة السابعة">الفرقة السابعة</option>
              </Select>
              <Input
                error={formik.errors.phone}
                onBlur={formik.handleBlur}
                touched={formik.touched.phone}
                value={formik.values.phone}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 text-end"
                label="رقم الهاتف"
                type="number"
                id="phone"
                name="phone"
                icon={<AiFillPhone />}
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
                  <Select
                    className="text-end mt-2"
                    error={formik.errors.gender}
                    touched={formik.touched.gender}
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    width={"100%"}
                    label="النوع"
                    id="gender"
                    name="gender"
                    icon={<PiGenderIntersexBold />}
                  >
                    <option value="">اختر النوع</option>
                    <option value="ذكر">ذكر</option>
                    <option value="انثى">انثى</option>
                  </Select>
                  <Input
                    className="text-end mt-2"
                    error={formik.errors.age}
                    touched={formik.touched.age}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    width={"100%"}
                    label="السن"
                    id="age"
                    name="age"
                    icon={<GoNumber />}
                  ></Input>
            </Col>
            <Col className="d-flex flex-column justify-content-between">
              <div className="d-flex flex-column">
                <Select
                  className="text-end mt-2 mt-md-0"
                  error={formik.errors.type}
                  touched={formik.touched.type}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  width={"100%"}
                  label="مريض مزمن ؟"
                  type="text"
                  id="type"
                  name="type"
                  icon={<FaVirusCovid />}
                >
                  <option value={true}>نعم</option>
                  <option value={false}>لا</option>
                </Select>
              </div>
              <Row>
                <Col>
                  <div className={`d-flex flex-column ${style.checkBox}`}>
                    <h6 className="text-end">الأمراض المزمنة</h6>
                    {location.pathname.includes("edit") ? (
                      <div className="">
                        {info.name &&
                          diseases.map((disease) => (
                            <Form.Check key={disease.name}>
                              <input
                                className="mt-2"
                                type="checkbox"
                                checked={formik.values.diseases.includes(
                                  disease.name
                                )}
                                disabled={
                                  formik.values.type === "false" ? true : false
                                }
                                onChange={() => {
                                  if (
                                    formik.values.diseases.includes(
                                      disease.name
                                    )
                                  ) {
                                    formik.setFieldValue(
                                      "diseases",
                                      formik.values.diseases.filter(
                                        (d) => d !== disease.name
                                      )
                                    );
                                  } else {
                                    formik.setFieldValue("diseases", [
                                      ...formik.values.diseases,
                                      disease.name,
                                    ]);
                                  }
                                }}
                              />
                              <label htmlFor={disease.id}>{disease.name}</label>
                            </Form.Check>
                          ))}
                      </div>
                    ) : diseases.length > 0 ? (
                      <div className="">
                        {diseases.map((disease, index) => (
                          <Form.Check key={index}>
                            <input
                              className="mt-2"
                              type="checkbox"
                              checked={formik.values.diseases.includes(
                                disease.name
                              )}
                              disabled={
                                formik.values.type === "false" ? true : false
                              }
                              onChange={() => {
                                if (
                                  formik.values.diseases.includes(disease.name)
                                ) {
                                  formik.setFieldValue(
                                    "diseases",
                                    formik.values.diseases.filter(
                                      (d) => d !== disease.name
                                    )
                                  );
                                } else {
                                  formik.setFieldValue("diseases", [
                                    ...formik.values.diseases,
                                    disease.name,
                                  ]);
                                }
                              }}
                            />
                            <label  style={{color : formik.values.type === "false" ? '#bfbfbf' : 'black'}} className="ms-2" htmlFor={disease.id}>
                              {disease.name}
                            </label>
                          </Form.Check>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className={style.under}></div>
                </Col>
                <Col
                  id="addnewsuplier"
                  xs="2"
                  className="d-flex align-items-center"
                >
                  <Tooltip
                    anchorSelect="#addnewsuplier"
                    clickable={true}
                    place="bottom"
                    style={{ fontSize: "12px" }}
                  >
                    إضافة مرض جديد
                  </Tooltip>
                  <IconV2
                    style={{
                      width: "100%",
                      height: "90%",
                      marginTop: "5px",
                      marginRight: "-5px",
                      paddingLeft: "20px",
                    }}
                    id="selectType"
                    icon={<FaVirusCovid style={{ marginLeft: "-20px" }} />}
                    onClick={() => {
                      setModelSupplier(true);
                    }}
                  />
                </Col>
              </Row>
              <div className={style.buttonandsvg} style={{ margin: "auto" }}>
                <div className="inner m-auto">
                  <div className={"svg text-center " + style.svgImg}>
                    <img src="/Hospitalpatient-bro.svg" alt="" />
                  </div>

                  <div className="btnnn text-center d-flex flex-row w-100 mt-2 gap-2">
                    <ButtonSubmit
                      disabled={!formik.isValid || loading}
                      className="btn-main w-100"
                    >
                      {loading
                        ? "جاري التحميل..."
                        : location.pathname.includes("edit")
                        ? "تعديل البيانات"
                        : "إضافة المريض"}
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
                        formik.resetForm();
                        formik.setValues({
                          level: "",
                          name: "",
                          collage: "",
                          phone: "",
                          national: "",
                          type: "true",
                          gender: "",
                          diseases: [],
                          stdID: "",
                          age: "",
                        });

                        sessionStorage.removeItem(
                          `name-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `level-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `collage-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `phone-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `national-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `type-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `gender-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `diseases-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `stdID-${window.location.pathname}`
                        );
                        sessionStorage.removeItem(
                          `age-${window.location.pathname}`
                        );
                      }}
                    >
                      <BiReset />
                      <Tooltip
                        anchorSelect="#not-clickable"
                        clickable={true}
                        style={{ fontSize: "12px" }}
                      >
                        اعادة تعيين البيانات
                      </Tooltip>
                    </Button>
                  </div>
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
        <Modal show={modelSupplier} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>إضافة مرض جديد</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSuppliers}>
              <Row className="flex-wrap">
                <Col>
                  <Input
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="اسم المرض"
                    type="text"
                    id="newSupplier"
                    name="newSupplier"
                    icon={<FaVirusCovid />}
                  />
                </Col>
              </Row>

              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit
                  disabled={!newSupplier.trim() || loading}
                  className="btn-main"
                  variant="primary"
                >
                  {loading ? "جاري التحميل..." : "إضافة المرض"}
                </ButtonSubmit>
                <Button className="btn-main" onClick={handleClose}>
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

export default AddNewPatient;
