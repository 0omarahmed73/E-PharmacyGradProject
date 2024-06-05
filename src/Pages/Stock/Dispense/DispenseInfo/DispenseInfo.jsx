import style from "./DispenseInfo.module.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Modal,
  Button,
  Accordion,
} from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ShowContext } from "../../../../context/ShowContext";
import { MedicineContext } from "../../../../context/MedicinesContext";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import Icon from "../../../../components/Icon/Icon";
import MenuItem from "../../../../components/MenuItem/MenuItem";
import MediSelected from "../../../../components/MediSelected/MediSelected";
import ButtonSubmit from "../../../../components/ButtonSubmit";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { Toast } from "bootstrap";
const DispenseInfo = () => {
  const [refresh, setRefresh] = useState(true);
  const [show, setShow] = useState(false);
  const [dispenseModel, setDispenseModel] = useState(false);
  const handleClose = () => {
    setShow(false);
    setDispenseModel(false);
    const updatedRadio = Object.keys(radio).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    setRadio(updatedRadio);

    const updatedAmountOfMedicine = Object.keys(amountOfMedicine).reduce(
      (acc, curr) => {
        acc[curr.name] = 0;
        return acc;
      },
      {}
    );
    setAmountOfMedicine(updatedAmountOfMedicine);
  };
  const [usageLoading, setUsageLoading] = useState(false);
  const [amountOfMedicine, setAmountOfMedicine] = useState({});
  const [radio, setRadio] = useState({});
  const [name, setName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [prices, setPrices] = useState([]);
  const [medicinePrices, setMedicinePrices] = useState([]);
  const navigate = useNavigate();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const {
    loading,
    error,
    setError,
    setLoading,
    deletePrescription,
    FetchPrescriptionInfo,
    fetchPrices,
    fetchNotifications,
  } = useContext(MedicineContext);
  const [type, setType] = useState([]);
  const [info, setInfo] = useState([]);
  const { id } = useParams();
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
    const func = async () => {
      setLoading(true);
      try {
        const data = await FetchPrescriptionInfo(id);
        setType(data.prsPrescriptionCategory.name);
        setMedicines(data.medicines);
        setName(data.patient);
        setInfo(data);
        handlePrices(data);
      } catch (error) {
        console.error("Error in useEffect:", error);
        setError(error.message);
      }
      const time = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => {
        clearInterval(time);
      };
    };
    func();
  }, [FetchPrescriptionInfo]);
  const handleOrderDelete = async (e) => {
    e.preventDefault();
    const response = await deletePrescription(id);
    if (response.ok) {
      toast.success("تم حذف الروشتة بنجاح");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
    handleClose();
  };
  useDocumentTitle("معلومات الروشتة");
  const handleUsage = async (e) => {
    setUsageLoading(true);
    e.preventDefault();
    const data = Object.keys(radio).reduce((acc, key) => {
      if (radio[key] !== "") {
        acc[key] = radio[key];
      }
      return acc;
    }, {});
    const data2 = Object.keys(amountOfMedicine).reduce((acc, key) => {
      if (amountOfMedicine[key] !== 0) {
        acc[key] = amountOfMedicine[key];
      }
      return acc;
    }, {});
    const finalData = Object.keys(amountOfMedicine).reduce((acc, key) => {
      if (key !== "" && radio[key]) {
        const flattenedPrices = prices.flat();
        const medicine = flattenedPrices.find(
          (med) =>
            med.orderMedicine &&
            med.orderMedicine.medicine &&
            med.orderMedicine.medicine.name === key &&
            med.orderMedicine.price == radio[key].price &&
            med.id == radio[key].id
        );
        if (medicine) {
          acc.push({
            amountNeeded: data2[key] || 0,
            inventory: medicine,
          });
        }
      }
      return acc;
    }, []);
    const response = await fetch(
      "https://pharmacy-1xjk.onrender.com/pharmacy/useages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          prescription: info,
          inventoryDto: finalData,
        }),
      }
    );

    if (response.ok) {
      toast.success("تم صرف الروشتة بنجاح");
      fetchNotifications();
    } else {
      const responseData = await response.json();
      const message = responseData.message;

      if (response.status === 401) {
        toast.error("غير مصرح لك بصرف هذه الروشتة");
      } else if (
        response.status === 400 &&
        message === "patient exceeded Useage times"
      ) {
        toast.error("وصل هذا المريض للحد الأقصى لصرف الروشتات");
      } else {
        toast.error("حدث خطأ ما , يرجى المحاولة مرة أخرى");
      }
    }
    setUsageLoading(false);
    setLoading(false);
    handlePrices(info);
    handleClose();
  };
  const handlePrices = async (data) => {
    if (refresh) {
      const prices = data.medicines.map(async (medi) => {
        try {
          const price = await fetchPrices(medi.barcode);
          return price;
        } catch (error) {
          console.error(
            `Error fetching prices for barcode ${medi.barcode}:`,
            error
          );
          return null; // or some default value
        }
      });
      const pricesData = await Promise.all(prices);

      const medicineNames = pricesData.flatMap((subArray) =>
        subArray.map((item) => {
          return {
            name: item.orderMedicine.medicine.name,
            price: item.orderMedicine.price,
            amountBeforeSubs: item.orderMedicine.amount,
            amount: item.orderMedicine.amount - item.amount,
            id: item.id,
            unit: item.orderMedicine.medicine.unit,
          };
        })
      );

      setMedicinePrices(medicineNames);
      setPrices(pricesData);

      const newRadio = medicineNames.reduce((acc, curr) => {
        acc[curr.name] = {
          price: "",
          id: curr.id,
        };
        return acc;
      }, {});
      setRadio(newRadio);
      const newAmountOfMedicine = medicineNames.reduce((acc, curr) => {
        acc[curr.name] = 0;
        return acc;
      }, {});
      setAmountOfMedicine(newAmountOfMedicine);
    }
  };
  const totalPrice = Object.keys(radio).reduce((total, key) => {
    const value = Number(radio[key]?.price) || 0;
    const amount = Number(amountOfMedicine[key]) || 0;
    return total + value * amount;
  }, 0);
  console.log("totalPrice:", totalPrice);

  console.log(medicinePrices);
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
      <Row className="flex-row justify-content-between">
        <Col xs="9" md="10">
          <LinkWithBack title={"معلومات الروشتة"} />
        </Col>
        <Col className="d-flex gap-1" xs="3" md="2">
          <Link to={`/stock/medicine-dispense/edit/${id}?return=yes`}>
            <Icon id="edit" icon={<BsPencil fill="white" />} />
          </Link>
          <Icon
            onClick={() => setShow(true)}
            id="delete"
            icon={<BsTrash fill="white" />}
          />
        </Col>

        <Tooltip
          anchorSelect="#delete"
          clickable={true}
          place={"left"}
          style={{ fontSize: "12px" }}
        >
          حذف الروشتة
        </Tooltip>
      </Row>
      <Tooltip
        anchorSelect="#edit"
        clickable={true}
        place={"right"}
        style={{ fontSize: "12px" }}
      >
        تعديل بيانات الروشتة
      </Tooltip>
      <Container className="d-flex mt-3 justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          {loading && !error && info.length === 0 ? (
            <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
              جاري التحميل...
            </div>
          ) : !loading && !error && info ? (
            <>
              <Row className="justify-content-center mb-1">
                <Col sm="6">
                  <MenuItem title={info.id} pt="mt-2 mt-md-0" isLink={false}>
                    رقم الروشتة
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem
                    title={info.diagnosis}
                    pt="mt-2 mt-md-0 p-1"
                    isLink={false}
                  >
                    التشخيص
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center ">
                <Col sm="6">
                  <MenuItem title={name.name} pt="mt-2 mt-md-0" isLink={false}>
                    اسم المريض
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem title={type} pt="mt-2 mt-md-0" isLink={false}>
                    نوع الروشتة
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center my-2">
                <div
                  className={`${style.mediTable} overflow-y-scroll mt-2 px-1`}
                >
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th className={"showFonts"}>#</th>
                        <th className={"showFonts"}>الدواء</th>
                        <th className={"showFonts"}>الباركود</th>
                        <th className={"showFonts"}>الصلاحية</th>
                        <th className={"showFonts"}>الشركة المصنعة</th>
                        <th className={"showFonts"}>السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && medicines.length > 0
                        ? medicines.map((medi, index) => (
                            <MediSelected
                              mode="orderInfo"
                              setId={id}
                              setMode={id}
                              key={medi.id}
                              name={medi.name}
                              quantity={medi.barcode}
                              price={"-"}
                              supplier={medi.manufacturer}
                              expire={"-"}
                              id={medi.barcode}
                              idx={index + 1}
                            />
                          ))
                        : null}
                    </tbody>
                  </Table>
                </div>
              </Row>
              <div className="d-flex flex-row-reverse justify-content-between gap-3 align-items-center">
                <div className="d-flex flex-row-reverse gap-3 align-items-end">
                  <Button
                    onClick={() => setDispenseModel(true)}
                    className="btn-main m-0"
                  >
                    صرف الروشتة
                  </Button>
                  <Button
                    className="btn-main m-0 "
                    onClick={() => window.print()}
                  >
                    طباعة
                  </Button>
                </div>
                <p className="fw-bold text-danger rtl fs-5">
                  {" "}
                  * لا تنسى صرف الروشتة
                </p>
              </div>
            </>
          ) : error ? (
            <p className="text-center p-0 m-0 mt-5 fw-bold">
              عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
            </p>
          ) : (
            <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
              عذراً , لا توجد نتائج
            </p>
          )}
        </div>
      </Container>
      {createPortal(
        <Modal show={show} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>هل انت متاكد من حذف الروشتة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleOrderDelete}>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit className="btn-danger">
                  نعم , أريد حذف الروشتة
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
      {createPortal(
        <Modal show={dispenseModel} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>صرف الروشتة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUsage}>
              <Accordion defaultActiveKey="0">
                {medicines.map((medi, index) => (
                  <Accordion.Item eventKey={index} key={medi.id}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between">
                        <p className="m-0 p-0">{medi.name}</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {medicinePrices.length > 0 ? (
                        <>
                          {medicinePrices
                            .filter((p1) => p1.name === medi.name)
                            .map((p2, i) => (
                              <Form.Check key={p2.name + i}>
                                <Form.Check.Input
                                  type="radio"
                                  name={p2.name}
                                  id={p2.name}
                                  value={p2.price}
                                  onChange={(e) => {
                                    setRadio((prevRadio) => ({
                                      ...prevRadio,
                                      [p2.name]: {
                                        price: e.target.value,
                                        id: p2.id,
                                      },
                                    }));
                                  }}
                                />{" "}
                                <Form.Check.Label>
                                  <p className="m-0 p-0 mb-1 fw-bold">{`السعر : ${p2.price}`}</p>
                                  <p className="m-0 p-0 mb-1 fw-bold">{`الكمية المتاحة : ${p2.amount} ${p2.unit}`}</p>{" "}
                                </Form.Check.Label>
                              </Form.Check>
                            ))}
                        </>
                      ) : null}
                      <div className="d-flex gap-2 justify-content-end">
                        <Form.Control
                          type="number"
                          min="0"
                          max={amountOfMedicine[medi.name]}
                          onChange={(e) => {
                            setAmountOfMedicine((prevAmount) => ({
                              ...prevAmount,
                              [medi.name]: Number(e.target.value),
                            }));
                          }}
                          value={amountOfMedicine[medi.name]}
                          placeholder="الكمية"
                          disabled={
                            !radio[medi.name] || !radio[medi.name].price
                          }
                        />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
                <p className="m-0 mt-2 fw-bold me-2">
                  الإجمالي :{" "}
                  {Object.keys(radio).reduce((total, key) => {
                    const value = radio[key].price || 0;
                    const amount = amountOfMedicine[key] || 0; // Use 0 if the key is not found in amountOfMedicines
                    return total + (value === "" ? 0 : Number(value) * amount);
                  }, 0)}{" "}
                  جنيه 
                </p>
                <p className="descriptiveP fs-16 m-0 me-2">
                  *الحد الأقصى للصرف هو 350 جنيه
                </p>
              </Accordion>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit
                  disabled={
                    usageLoading ||
                    totalPrice <= 0 ||
                    totalPrice > 350 ||
                    isNaN(totalPrice) // Ensure the total price is less than or equal to 350
                  }
                  className="btn-main"
                >
                  {usageLoading ? "جاري الصرف..." : "صرف الروشتة"}
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

export default DispenseInfo;
