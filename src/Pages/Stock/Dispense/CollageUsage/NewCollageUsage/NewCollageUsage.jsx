import Cookies from "js-cookie";
import style from "./NewCollageUsage.module.css";
import { createPortal } from "react-dom";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Table,
  Accordion,
} from "react-bootstrap";
import Input from "../../../../../components/input/Input";
import { useFormik } from "formik";
import { BiBarcodeReader, BiCalendar, BiReset } from "react-icons/bi";
import { AiFillLock, AiOutlineNumber } from "react-icons/ai";
import { GiMedicinePills, GiPill } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import ButtonSubmit from "../../../../../components/ButtonSubmit";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import { useContext, useEffect, useState } from "react";
import MediSelected from "./../../../../../components/MediSelected/MediSelected";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { ShowContext } from "../../../../../context/ShowContext";
import { motion } from "framer-motion";
import InputAutoComplete2 from "../../../../../components/InputAutoComplete2/InputAutoComplete2";
import LinkWithBack from "../../../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../../../context/MedicinesContext";
import IconV2 from "../../../../../components/IconV2/IconV2";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import Select from "./../../../../../components/Select/Select";
import { PiFactoryFill } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
const NewCollageUsage = () => {
  const naviate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading3, setLoading3] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const {
    nameOrCode,
    handleNameOrCode,
    error: error2,
    fetchNotifications,
    fetchInventoryWithoutAll,
    fetchPrices,
  } = useContext(MedicineContext);
  const [fetchedInventoryWithOutAlled, setFetchedInventoryWithOutAlled] =
    useState([
      {
        id: 0,
        amount: 0,
        orderMedicine: {
          id: 0,
          amount: 0,
          price: 0,
          expirydate: "2026-10-01",
          medicine: {
            id: 0,
            barcode: 0,
            name: " ",
            arabicname: "  ",
            dosageform: null,
            strength: null,
            activeingredient: "  ",
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
    ]);
  const [change, setChange] = useState(false);
  const falseChange = () => {
    setChange(false);
  };
  useDocumentTitle(
    location.pathname.includes("edit")
      ? "تعديل معلومات إذن قديم"
      : "إضافة إذن جديد"
  );
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const [error, setError] = useState(null);
  const {
    items,
    getMedicines,
    fetchCollageUsageInfo,
    suppliers,
    medicineList,
    handleCollageUsage,
    itemsWithCompany,
    updateCollageUsage,
  } = useContext(MedicineContext);
  const { show: show2 } = useContext(ShowContext);
  const [mode, setMode] = useState("");
  const [modelSupplier, setModelSupplier] = useState(false);
  const [currentId, setId] = useState("");
  const [name, setName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [expire, setExpire] = useState("");
  const [price, setPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [show, setShow] = useState(false);
  const [usageLoading, setUsageLoading] = useState(false);
  const [info, setInfo] = useState({
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
            expirydate: "2026-10-01",
            medicine: {
              id: 0,
              barcode: 0,
              name: "0",
              arabicname: "0 ",
              dosageform: null,
              strength: null,
              activeingredient: "aripirazole ",
              manufacturer: "otsuka",
              alertamount: 10,
              alertexpired: 5,
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
    totalPrice: 0.0,
  });
  const [fetched, setFetched] = useState(false);
  const [amountOfMedicine, setAmountOfMedicine] = useState({});
  const [radio, setRadio] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [prices, setPrices] = useState([]);
  const [medicinePrices, setMedicinePrices] = useState([]);
  const [medicines, setMedicines] = useState(
    sessionStorage.getItem(`medicines-${location.pathname}`)
      ? JSON.parse(sessionStorage.getItem(`medicines-${location.pathname}`))
      : []
  );
  const medicineRef = useRef(null);
  const handleClose = () => {
    setShow(false);
    setName("");
    setQuantity("");
    setExpire("");
    setPrice("");
    setSupplier("");
    setModelSupplier(false);
    setNewSupplier("");
    const updatedRadio = Object.keys(radio).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    setRadio(updatedRadio);

    const updatedAmountOfMedicine = Object.keys(amountOfMedicine).reduce(
      (acc, curr) => {
        acc[curr] = 0;
        return acc;
      },
      {}
    );
    setAmountOfMedicine(updatedAmountOfMedicine);
  };

  const handleShow = () => {
    setShow(true);
    setError(null);
    setModelSupplier(false);
  };
  const formik = useFormik({
    validateOnMount: true,
    initialValues: location.pathname.includes("edit")
      ? {
          reqnum: "",
          delivaryAuth: "",
          collageName: "",
          dateofsupply: "",
        }
      : {
          reqnum: sessionStorage.getItem(`reqnum-${location.pathname}`) || "",
          delivaryAuth:
            sessionStorage.getItem(`delivaryAuth-${location.pathname}`) || "",
          collageName:
            sessionStorage.getItem(`collageName-${location.pathname}`) || "",
          dateofsupply:
            sessionStorage.getItem(`dateofsupply-${location.pathname}`) || "",
        },
    validationSchema: yup.object().shape({
      reqnum: yup.number().required("الرجاء ادخال رقم إذن الصرف"),
      collageName: yup.string().required("الرجاء ادخال اسم الكلية"),
      dateofsupply: yup.date().required("الرجاء ادخال تاريخ التوريد"),
    }),
    onSubmit: async (values) => {
      console.log(medicines);
      console.log(fetchedInventoryWithOutAlled);
      !location.pathname.includes("edit")
        ? (values = {
            date: values.dateofsupply,
            id: values.reqnum,
            collegeName: values.collageName,
            collegeUseagesMedicines: medicines.map((medi) => {
              return {
                amount: medi.quantity,
                inventory: fetchedInventoryWithOutAlled.find(
                  (inventory) => inventory.id === medi.id
                ),
              };
            }),
          })
        : (values = {
            date: values.dateofsupply,
            id: values.reqnum,
            collegeName: values.collageName,
            collegeUseagesMedicines: medicines.map((medi) => {
              return {
                amount: medi.quantity,
                inventory: fetchedInventoryWithOutAlled.find(
                  (inventory) => inventory.id === medi.id
                ),
              };
            }),
          });
      setLoading2(true);
      console.log(values);
      const response = location.pathname.includes("edit")
        ? await updateCollageUsage(values, id)
        : await handleCollageUsage(values);
      if (response.ok) {
        toast.success(
          location.pathname.includes("edit")
            ? "تم تعديل إذن الصرف بنجاح"
            : "تم ادخال الإذن بنجاح"
        );
        setMedicines([]);
        formik.resetForm();
        sessionStorage.setItem(`reqnum-${window.location.pathname}`, "");
        sessionStorage.setItem(`delivaryAuth-${window.location.pathname}`, "");
        sessionStorage.setItem(`collageName-${window.location.pathname}`, "");
        sessionStorage.setItem(`medicines-${window.location.pathname}`, "");
        sessionStorage.setItem(`dateofsupply-${window.location.pathname}`, "");
        formik.setValues({
          reqnum: "",
          delivaryAuth: "",
          collageName: "",
          dateofsupply: "",
        });
        fetchNotifications();
        handlePrices(medicineList);
        fetchInventoryWithoutAll();
      }
      setLoading2(false);
    },
  });
  const handleMedicines = (e) => {
    e.preventDefault();
    //Search for the medicine in the items array
    const found = items.find((item) => item === name.trim());
    //Check if the medicine already added to the order
    const alreadyExists = medicines.find((medi) => medi.name === name);
    if (found && !alreadyExists) {
      const getMedi = [
        ...medicines,
        {
          id: radio[name].id,
          name,
          quantity: amountOfMedicine[name],
          price: parseInt(radio[name].price) * parseInt(amountOfMedicine[name]),
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
      toast.error("الرجاء التأكد من ادخال اسم الدواء بشكل صحيح");
    } else if (alreadyExists) {
      toast.error("الدواء موجود بالفعل في الإذن");
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
  const handleEdit = (id, name) => {
    const medicine = medicines.find((medi) => medi.name === name);
    setName(medicine.name);
    setQuantity(medicine.quantity);
    setExpire(medicine.expire);
    setPrice(medicine.price);
    setSupplier(medicine.supplier);
    handleShow();
  };
  const saveChanges = (id) => {
    const newMedicine = medicines.map((medi) => {
      if (medi.id === id) {
        return {
          ...medi,
          id: radio[name].id,
          name,
          quantity: amountOfMedicine[name],
          price: parseInt(radio[name].price) * parseInt(amountOfMedicine[name]),
        };
      }

      return medi;
    });
    sessionStorage.setItem(
      `medicines-${window.location.pathname}`,
      JSON.stringify(newMedicine)
    );
    setMedicines(newMedicine);
    handleClose();
  };
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const func = async () => {
        try {
          setLoading3(true);
          const data = await fetchCollageUsageInfo(id);
          handlePrices(medicineList);
          const data2 = await fetchInventoryWithoutAll();
          setFetchedInventoryWithOutAlled(data2);
          const date = new Date(data.date).toISOString().split("T")[0];
          formik.setValues({
            reqnum: data.id,
            collageName: data.collegeName,
            dateofsupply: date,
          });
          const getMedicines = [...data.collegeUseageMedicines];
          if (getMedicines.length > 0) {
            setMedicines(() => {
              return getMedicines.map((e) => {
                if (e.inventory.orderMedicine) {
                  return {
                    ...medicines,
                    id: e.inventory.orderMedicine.id,
                    name: e.inventory.orderMedicine.medicine.name,
                    quantity: e.amount,
                    price: e.inventory.orderMedicine.price,
                  };
                }
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
  }, [fetchCollageUsageInfo]);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        handlePrices(medicineList);
        const data = await fetchInventoryWithoutAll();
        setFetchedInventoryWithOutAlled(data);
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
  }, [medicineList]);
  const handlePrices = async (data) => {
    if (refresh) {
      const prices = data.map(async (medi) => {
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
      const pricesData = (await Promise.all(prices)).filter(
        (price) => price.length > 0
      );

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
      className={`${style.newOrder} d-flex flex-column px-sm-5 px-0 pb-4 w-md-75 w-sm-100 w-lg-100`}
    >
      {spinner && spinnerElement}
      <LinkWithBack
        title={
          location.pathname.includes("edit")
            ? "تعديل معلومات إذن قديم"
            : "إضافة إذن جديد"
        }
        link="/stock/medicine-dispense/collage-usage"
      />
      {loading || loading3 ? (
        <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
          جاري التحميل...
        </div>
      ) : !loading3 && !loading && !error ? (
        <Form onSubmit={formik.handleSubmit}>
          <Row className="flex-wrap" lg="2" xs="1" md="1">
            <Col>
              <Input
                className="text-end"
                error={formik.errors.reqnum}
                touched={formik.touched.reqnum}
                onBlur={formik.handleBlur}
                value={formik.values.reqnum}
                onChange={formik.handleChange}
                width={"100%"}
                label="إذن الصرف"
                type="number"
                id="reqnum"
                name="reqnum"
                icon={"#"}
              />
              <Row>
                <Col xs="12">
                  <Select
                    error={formik.errors.collageName}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.collageName}
                    value={formik.values.collageName}
                    onChange={formik.handleChange}
                    width={"100%"}
                    className="mt-2 text-end"
                    label="اسم الكلية"
                    id="collageName"
                    name="collageName"
                    icon={<FaUniversity />}
                  >
                    <option value="">اختر الكلية</option>
                    <option value="كلية الهندسة بشبرا">
                      كلية الهندسة بشبرا
                    </option>
                    <option value="كلية الهندسة ببنها">
                      كلية الهندسة ببنها
                    </option>
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
                    <option value="كلية العلاج الطبيعي">
                      كلية العلاج الطبيعي
                    </option>
                  </Select>
                </Col>
              </Row>

              <div className={`${style.mediTable} overflow-y-scroll mt-2 px-1`}>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th className={show2 ? "showFonts" : "noshowFonts"}>#</th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}>
                        الدواء
                      </th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}>
                        الكمية
                      </th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}></th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}></th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}>
                        السعر الكلي
                      </th>
                      <th className={show2 ? "showFonts" : "noshowFonts"}>
                        الأيقونات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.length && medicines[0].name
                      ? medicines.map((medi, index) => (
                          <MediSelected
                            show={show2}
                            mode="order"
                            setId={setId}
                            setMode={setMode}
                            key={uuidv4()}
                            name={medi.name}
                            quantity={medi.quantity}
                            price={medi.price}
                            supplier={medi.supplier}
                            expire={medi.expire}
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
            </Col>
            <Col className="">
              <Input
                error={formik.errors.dateofsupply}
                onBlur={formik.handleBlur}
                touched={formik.touched.dateofsupply}
                value={formik.values.dateofsupply}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 mt-lg-0 text-end"
                label="تاريخ الصرف"
                type="date"
                id="dateofsupply"
                name="dateofsupply"
                icon={<BiCalendar />}
              />
              <div className={`${style.buttonandsvg} overflow-hidden mt-2`}>
                <div
                  className=""
                  style={{ width: "fit-content", margin: "auto" }}
                >
                  <div
                    className={`${style.imgSvg} btnnn text-center mt-4 mt-lg-0 m-auto`}
                  >
                    <img src="/medicine.svg" alt="" />
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
                      ? "تعديل الإذن"
                      : "إضافة الإذن"}
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
                        `reqnum-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `delivaryAuth-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `collageName-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `medicines-${window.location.pathname}`,
                        ""
                      );
                      sessionStorage.setItem(
                        `dateofsupply-${window.location.pathname}`,
                        ""
                      );
                      setMedicines([]);
                      formik.resetForm();
                      formik.setValues({
                        reqnum: "",
                        delivaryAuth: "",
                        collageName: "",
                        dateofsupply: "",
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
            <Form onSubmit={handleMedicines}>
              <Row className="flex-wrap">
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
                      allValues={itemsWithCompany}
                      linkedAttr={[{ name: "supplier", setValue: setSupplier }]}
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
                      error={error2}
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
                  <p className="descriptiveP">
                    يمكنك البحث باستعمال اسم الدواء او الباركود*
                  </p>
                </Col>
              </Row>
              <Accordion className="mt-2" defaultActiveKey="0">
                {medicineList
                  .filter((medi) => medi.name === name)
                  .map((medi, index) => (
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
              </Accordion>
              <Row></Row>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                {mode === "edit" ? (
                  <Button
                    disabled={
                      usageLoading ||
                      totalPrice <= 0 ||
                      isNaN(totalPrice) // Ensure the total price is less than or equal to 350
                    }
                    variant="danger"
                    onClick={() => saveChanges(currentId)}
                  >
                    حفظ التعديلات
                  </Button>
                ) : (
                  <ButtonSubmit
                    disabled={
                      usageLoading ||
                      totalPrice <= 0 ||
                      isNaN(totalPrice) // Ensure the total price is less than or equal to 350
                    }
                    className="btn-main"
                  >
                    إضافة الدواء
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

export default NewCollageUsage;
