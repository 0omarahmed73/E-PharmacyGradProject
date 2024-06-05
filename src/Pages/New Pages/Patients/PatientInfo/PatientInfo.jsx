import style from "./PatientInfo.module.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../context/ShowContext";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import { BsPencil } from "react-icons/bs";
import Icon from "../../../../components/Icon/Icon";
import { Tooltip } from "react-tooltip";
import { MedicineContext } from "../../../../context/MedicinesContext";
const PatientInfo = () => {
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [info, setInfo] = useState({});
  const [disease, setDisease] = useState([]);
  const { FetchPatientInfo, loading, setLoading, error, setError } =
    useContext(MedicineContext);
  let { type, id } = useParams();
  const realType = type;
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
  useDocumentTitle("معلومات المريض");
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await FetchPatientInfo(id);
        setDisease(data.disease);
        setInfo(data);
      } catch (error) {
        setError(true);
      }
      const time = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => {
        clearInterval(time);
      };
    };
    func();
  }, [FetchPatientInfo, id]);
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
      <Row
        className="flex-row justify-content-center m-auto"
        style={{ width: "95%" }}
      >
        <Col xs="10" sm="11">
          <LinkWithBack
            title={"معلومات المريض"}
            link={`/patients/${realType}`}
          />
        </Col>
        <Col xs="2" sm="1" className="ps-4 ps-sm-0">
          <Link to={"/patients/edit/" + id + "?return=yes"}>
            <Icon id="edit" icon={<BsPencil fill="white" />} />
          </Link>
        </Col>
        <Tooltip
          anchorSelect="#edit"
          clickable={true}
          place={"left"}
          style={{ fontSize: "12px" }}
        >
          تعديل بيانات المريض
        </Tooltip>
      </Row>{" "}
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div style={{ width: "100%" }}>
          {loading && !error && !info.name ? (
            <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
              جاري التحميل...
            </div>
          ) : !loading && !error && info.name ? (
            <Row className="w-100 m-0 ">
              <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
                <div className={`${style.rowTitle}`}>
                  <Row className={"w-100 " + style.allParts}>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">اسم الطالب : </h5>
                        <h5 className="fw-bold m-0 p-0">{info.name}</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className={"w-100 " + style.allParts}>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">
                          الرقم القومي للطالب :{" "}
                        </h5>
                        <h5 className="fw-bold m-0 p-0">{info.nationalid}</h5>
                      </div>
                    </Col>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">اسم الكلية : </h5>
                        <h5 className="fw-bold m-0 p-0">{info.collegeName}</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className={"w-100 " + style.allParts}>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">الفرقة : </h5>
                        <h5 className="fw-bold m-0 p-0">{info.level}</h5>
                      </div>
                    </Col>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">رقم الهاتف : </h5>
                        <h5 className="fw-bold m-0 p-0">{info.phone_number}</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className={"w-100 " + style.allParts}>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">
                          الرقم القومي :{" "}
                        </h5>
                        <h5 className="fw-bold m-0 p-0">01024119988</h5>
                      </div>
                    </Col>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">النوع : </h5>
                        <h5 className="fw-bold m-0 p-0">{info.gender}</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className={"w-100 " + style.allParts}>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">السن : </h5>
                        <h5 className="fw-bold m-0 p-0">
                          {info.age || "غير مدرج"}
                        </h5>
                      </div>
                    </Col>
                    <Col className={style.part2}>
                      <div className="d-flex align-items-center">
                        <h5 className="fw-bold m-0 p-0 ms-2">نوع المرض : </h5>
                        <h5 className="fw-bold m-0 p-0">
                          {info.chronic == true ? "مزمن" : "غير مزمن"}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className={"w-100 " + style.allParts}>
                    {disease.length > 0 ? (
                      <Col className={style.part2}>
                        <div className="d-flex align-items-center flex-column">
                          <h5 className="fw-bold m-0 p-0 ms-2 mb-2">
                            قائمة الامراض :
                          </h5>
                          {disease.map((disease, index) => {
                            return (
                              <h5 className="fw-bold m-0 p-0 mb-2" key={index}>
                                {disease.name}
                              </h5>
                            );
                          })}
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                </div>
              </Container>
              <div className="d-flex flex-row-reverse align-items-end mt-3 mb-4">
                <Button
                  className={`btn-main px-3`}
                  onClick={() => window.print()}
                >
                  طباعة
                </Button>
              </div>
            </Row>
          ) : error ? (
            <p className="text-center text-black p-0 m-0 mt-5 fw-bold">
              عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
            </p>
          ) : (
            <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
              عذراً , لا توجد نتائج
            </p>
          )}
        </div>
      </Container>
    </motion.div>
  );
};

export default PatientInfo;
