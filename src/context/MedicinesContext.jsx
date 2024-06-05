import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import axiosApi from "../data/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const MedicineContext = createContext();

const MedicinesProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [wholeOrders, setWholeOrders] = useState([]);
  const [medicineType, setMedicineType] = useState([]);
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [itemsWithCompany, setItemsWithCompany] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [nameOrCode, setNameOrCode] = useState(
    localStorage.getItem("nameOrCode") || "code"
  );
  const baseUrl = "https://pharmacy-1xjk.onrender.com/";
  ////////////////////////////  Start of Medicine Controllers  ////////////////////////////

  //Change Searching Mode : With name or barcode
  const handleNameOrCode = () => {
    setNameOrCode(nameOrCode === "name" ? "code" : "name");
    localStorage.setItem("nameOrCode", nameOrCode === "name" ? "code" : "name");
  };
  // Get All Medicines
  const setResponses = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get(baseUrl + "pharmacy/medicines", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      setMedicineList(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };
  // Searching for Medicine Handler
  const getMedicines = async (name) => {
    let names = medicineList.map((medi) => ({
      name: medi.name,
      code: medi.barcode.toString(),
      supplier: medi.manufacturer,
    }));
    names =
      nameOrCode === "name"
        ? names.filter(
            (el) => el.name !== "" && el.name.startsWith(name.toUpperCase())
          )
        : names.filter((el) => el.name !== "" && el.code.startsWith(name));
    setItemsWithCompany(() => {
      return names.map((el) => ({ name: el.name, supplier: el.supplier }));
    });
    names = names.map((el) => el.name);
    setItems(names);
  };

  const MedicineByCategories = useCallback(async (type) => {
    let link;
    if (type === "all") {
      link = baseUrl + "pharmacy/medicines";
    } else if (type === "8") {
      link = baseUrl + "pharmacy/medicines/mix";
    } else {
      link = `${baseUrl}pharmacy/medicines/category/${type}`;
    }
    try {
      const response = await axiosApi.get(link, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Get Medicine Type
  const getMedicineType = useCallback(async () => {
    const response = await axiosApi.get(
      baseUrl + "pharmacy/medicinecategories",
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      }
    );
    const names = response.data;
    setMedicineType(names);
  }, []);
  //Add New Medicine Type
  const addNewMedicineType = async (name) => {
    const response = await fetch(baseUrl + "pharmacy/medicinecategories", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة نوع دواء جديد");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };
  const isMount = useRef(true);
  // Run on Component Mount to get Medicine Type and Medicines
  useEffect(() => {
    if (isMount.current && user) {
      setResponses();
      getMedicineType();
      isMount.current = false;
      setError(null);
    }
  }, [user]);

  // Fetch Medicine Infos
  const FetchMedicineInfos = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${baseUrl}pharmacy/medicines/${id}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
            },
          }
        );
        setLoading(false);
        return response.data;
      } catch (error) {
        setError(error.message);
      }
    },
    [setError, setLoading]
  );
  // Submiting Medicine Handler
  const submitMedicine = async (medicine) => {
    const response = await fetch(baseUrl + "pharmacy/medicines", {
      method: "POST",
      body: JSON.stringify({
        arabicname: medicine.strength
          ? medicine.ar + " " + medicine.strength
          : medicine.ar,
        name: medicine.strength
          ? medicine.en.trim().toUpperCase() + " " + medicine.strength
          : medicine.en.trim().toUpperCase(),
        medicineCategory: medicine.type,
        manufacturer: medicine.company,
        alertamount: medicine.quantity,
        barcode: medicine.code,
        alertexpired: medicine.days,
        activeingredient: medicine.activeingredient,
        strength: medicine.strength,
        unit: medicine.large || medicine.small,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة دواء جديد");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    setResponses();
    return response;
  };

  // Delete Medicine Handler
  const deleteMedicine = async (id) => {
    const response = await fetch(baseUrl + `pharmacy/medicines/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بحذف هذا الدواء");
        setError("غير مصرح لك بحذف هذا الدواء");
      } else {
        toast.error(
          "حدث خطأ ما , الرجاء التأكد أن الدواء غير مستعمل في أي روشتة او طلبية"
        );
      }
    }
    setResponses();
    return response;
  };
  // Update Medicine Handler
  const updateMedicine = async (medicine) => {
    const response = await fetch(baseUrl + `pharmacy/medicines`, {
      method: "PUT",
      body: JSON.stringify({
        arabicname: medicine.ar,
        name: medicine.en.trim().toUpperCase(),
        medicineCategory: medicine.type,
        manufacturer: medicine.company,
        alertamount: medicine.quantity,
        barcode: medicine.code,
        alertexpired: medicine.days,
        activeingredient: medicine.activeingredient,
        strength: medicine.strength,
        unit: medicine.large || medicine.small,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بتعديل بيانات هذا الدواء");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    setResponses();
    return response;
  };

  ////////////////////////////  End of Medicine Controllers  ////////////////////////////

  ////////////////////////////  Start of Orders Controllers  ////////////////////////////
  // New Order Form Handler
  const handleNewOrder = async (order) => {
    const orderNames = order.medicine.map((el) => el.name);
    const medi2 = medicineList.filter((medi) => orderNames.includes(medi.name));
    try {
      const response = await fetch(baseUrl + "pharmacy/orders", {
        method: "POST",
        body: JSON.stringify({
          supplyrequest: order.reqnum,
          deliveryrequest: order.delivaryAuth,
          dateofsupply: order.dateofsupply,
          supplier: order.supplierName,
          orderMedicines: [
            ...order.medicine.map((medi) => ({
              medicine: {
                ...(medi2
                  ? medi2.filter((el) => el.name === medi.name)
                  : null)[0],
              },
              amount: parseInt(medi.quantity),
              price: parseInt(medi.price),
              expirydate: medi.expire,
            })),
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("غير مصرح لك بإضافة طلبية جديدة");
        } else {
          toast.error("حدث خطأ ما");
        }
      }
      fetchNotifications();
      return response;
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  //Fetch Orders
  const fetchOrders = useCallback(async () => {
    let link = baseUrl + "pharmacy/orders";
    try {
      setLoading(true);
      const response = await axiosApi.get(link, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, [setError, setLoading]);
  // Fetch Order Infos
  const FetchOrderInfo = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await axiosApi.get(`${baseUrl}pharmacy/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
          },
        });
        setLoading(false);
        return response.data;
      } catch (error) {
        setError(error.message);
      }
    },
    [setError, setLoading]
  );

  //Update Old Order
  const updateOrder = async (order) => {
    const orderNames = order.medicine.map((el) => el.name);
    const medi2 = medicineList.filter((medi) => orderNames.includes(medi.name));
    const response = await fetch(baseUrl + `pharmacy/orders`, {
      method: "PUT",
      body: JSON.stringify({
        id: order.id,
        supplyrequest: order.reqnum,
        deliveryrequest: order.delivaryAuth,
        dateofsupply: order.dateofsupply,
        supplier: order.supplierName,
        orderMedicines: [
          ...order.medicine.map((medi) => ({
            medicine: {
              ...(medi2
                ? medi2.filter((el) => el.name === medi.name)
                : null)[0],
            },
            id: medi.orderId,
            amount: parseInt(medi.quantity),
            price: parseInt(medi.price),
            expirydate: medi.expire,
          })),
        ],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بتعديل بيانات هذه الطلبية");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    fetchNotifications();
    return response;
  };
  // Delete Order
  const deleteOrder = async (id) => {
    const response = await fetch(baseUrl + `pharmacy/orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بحذف هذه الطلبية");
      } else if (
        response.status === 400 ||
        response.body.message ===
          'could not execute statement [ERROR: delete on table "orders" violates foreign key constraint "orderFK" on table "order_medicine"\n  Detail: Key (id)=(29) is still referenced from table "order_medicine".] [delete from orders where id=?]; SQL [delete from orders where id=?]; constraint [orderFK]'
      ) {
        toast.error("لا يمكن حذف هذه الطلبية لوجود روشتات مرتبطة بها");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    fetchNotifications();
    return response;
  };
  ////////////////////////////  End of Orders Controllers  ////////////////////////////

  ////////////////////////////  Start of Suppliers Controllers  ////////////////////////////
  // Get Suppliers
  const suppliersHandler = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/suppliers", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Add New Supplier
  const postNewSupplier = async (name) => {
    try {
      const response = await fetch(baseUrl + "pharmacy/suppliers", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("غير مصرح لك بإضافة مورد جديد");
        } else {
          toast.error("حدث خطأ ما");
        }
      }
      suppliersHandler();
      return response;
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  ////////////////////////////  End of Suppliers Controllers  ////////////////////////////

  ////////////////////////////  Start of Patients Controllers  ////////////////////////////

  // Fetch Diseases
  const fetchDiseases = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/diseases", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Add new Patient
  const addNewPatient = async (patient) => {
    const response = await fetch(baseUrl + "pharmacy/patients", {
      method: "POST",
      body: JSON.stringify({
        nationalid: patient.national,
        phone_number: patient.phone,
        student_id: patient.stdID,
        gender: patient.gender,
        name: patient.name,
        chronic: patient.type,
        level: patient.level,
        collegeName: patient.collage,
        disease: patient.diseases,
        age: patient.age,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة مريض جديد");
      } else if (data.message === "id is Exist id") {
        toast.error(
          "الرقم القومي موجود بالفعل , الرقم التاكد من صحة الرقم القومي"
        );
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    fetchPatients();
    return response;
  };

  //Fetch Patients
  const fetchPatients = useCallback(async (type = "all") => {
    let endPoint;
    if (type === "chronic") {
      endPoint = baseUrl + "pharmacy/patients/type?isChronic=true";
    } else if (type === "emergency") {
      endPoint = baseUrl + "pharmacy/patients/type?isChronic=false";
    } else {
      endPoint = baseUrl + "pharmacy/patients";
    }
    try {
      const response = await axiosApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Fetch Patient Infos
  const FetchPatientInfo = useCallback(
    async (id) => {
      try {
        const response = await axiosApi.get(
          baseUrl + `pharmacy/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        setError(error.message);
      }
    },
    [setError]
  );

  // Update Patient
  const updatePatient = async (patient) => {
    const response = await fetch(baseUrl + `pharmacy/patients`, {
      method: "PUT",
      body: JSON.stringify({
        nationalid: patient.national,
        phone_number: patient.phone,
        student_id: patient.stdID,
        gender: patient.gender,
        name: patient.name,
        chronic: patient.type,
        level: patient.level,
        collegeName: patient.collage,
        disease: patient.diseases,
        age: patient.age,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بتعديل بيانات هذا المريض");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    fetchPatients();
    return response;
  };

  //Add New Disease
  const addNewDisease = async (disease) => {
    const response = await fetch(baseUrl + "pharmacy/diseases", {
      method: "POST",
      body: JSON.stringify({ name: disease }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة مرض جديد");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };
  ////////////////////////////  End of Patients Controllers  ////////////////////////////

  ////////////////////////////  Start of Prescription Controllers  ////////////////////////////
  // Add New Prescription
  const addNewPrescription = async (prescription) => {
    const response = await fetch(baseUrl + "pharmacy/prescriptions", {
      method: "POST",
      body: JSON.stringify({
        id: prescription.prescriptionNumber,
        prsPrescriptionCategory: prescription.prescriptionType,
        diagnosis: prescription.disease,
        patient: prescription.patient,
        medicines: prescription.medicine,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة وصفة جديدة");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };

  /// Fetch Precreptions
  const fetchPrescriptions = useCallback(async (type = "all") => {
    const link =
      type === "all"
        ? baseUrl + "pharmacy/prescriptions"
        : type === "chronic"
        ? baseUrl + "pharmacy/prescriptions/type?isChronic=true"
        : type === "emergency"
        ? baseUrl + "pharmacy/prescriptions/type?isChronic=false"
        : "";
    try {
      const response = await axiosApi.get(link, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Fetch Prescription Infos
  const FetchPrescriptionInfo = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          baseUrl + `pharmacy/prescriptions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
            },
          }
        );
        setLoading(false);
        return response.data;
      } catch (error) {
        setError(error.message);
      }
    },
    [setError]
  );

  //Handle Delete Prescription
  const deletePrescription = async (id) => {
    const response = await fetch(baseUrl + `pharmacy/prescriptions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بحذف هذه الروشتة");
      } else if (
        response.status === 400 ||
        response.body.message ===
          'could not execute statement [ERROR: delete on table "orders" violates foreign key constraint "orderFK" on table "order_medicine"\n  Detail: Key (id)=(29) is still referenced from table "order_medicine".] [delete from orders where id=?]; SQL [delete from orders where id=?]; constraint [orderFK]'
      ) {
        toast.error("لا يمكن حذف هذه الروشتة لانه تم صرفها");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };

  // Update Prescription
  const updatePrescription = async (prescription) => {
    const response = await fetch(baseUrl + `pharmacy/prescriptions`, {
      method: "PUT",
      body: JSON.stringify({
        id: prescription.prescriptionNumber,
        prsPrescriptionCategory: prescription.prescriptionType,
        diagnosis: prescription.disease,
        patient: prescription.patient,
        medicines: prescription.medicine,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بتعديل بيانات هذه الروشتة");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };

  //Fetch Prices
  const fetchPrices = useCallback(async (id) => {
    try {
      const response = await axiosApi.get(
        baseUrl + `pharmacy/inventory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  //Fetch Usage
  const fetchUsage = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + `pharmacy/useages`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Fetch Usage Details
  const fetchUsageDetails = useCallback(async (id) => {
    try {
      const response = await axiosApi.get(baseUrl + `pharmacy/useages/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Delete Usage
  const deleteUsage = async (id) => {
    const response = await fetch(baseUrl + `pharmacy/useages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بحذف هذه الروشتة المصروفة");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };

  ////////////////////////////  End of Prescription Controllers  ////////////////////////////

  ////////////////////////////  Start of Inventory Controllers  ////////////////////////////
  //Fetch Inventory Medicines
  const fetchInventory = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/inventory/all", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  const fetchInventoryWithoutAll = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/inventory", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  ////////////////////////////  End of Inventory Controllers  ////////////////////////////

  ////////////////////////////  Start of Notiications Controllers  ////////////////////////////

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/notifications", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      const data = {
        time: new Date().toLocaleTimeString(),
        data: response.data.map((item) => {
          return {
            name: item.medicine.arabicname,
            message: item.message,
          };
        }),
      };
      setNotifications(data), setNotificationsData(data.data);
      return response.data;
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  // Fetch Notifications Periodically
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      await fetchNotifications();
      console.log("fetching notifications...");
      setLoading(false);
    }, 3600000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);
  ////////////////////////////  End of Notiications Controllers  ////////////////////////////

  ////////////////////////////  Start of Reports Controllers  ////////////////////////////
  // Fetch Sales
  const fetchSales = useCallback(async (month, year) => {
    try {
      const response = await axiosApi.get(
        baseUrl + `pharmacy/inventory/sales?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Fetch Collages
  const fetchCollages = useCallback(async (month, year) => {
    try {
      const response = await axiosApi.get(
        baseUrl + `pharmacy/inventory/college?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  ////////////////////////////  End of Reports Controllers  ////////////////////////////

  ////////////////////////////  Start of Collage Usages Provider  ////////////////////////////
  const handleCollageUsage = async (collage) => {
    const response = await fetch(`${baseUrl}pharmacy/collegeuseages`, {
      method: "POST",
      body: JSON.stringify({
        ...collage,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة استهلاك كلية جديد");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };
  const fetchCollageUsage = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/collegeuseages", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  const fetchCollageUsageInfo = useCallback(async (id) => {
    try {
      const response = await axiosApi.get(
        `${baseUrl}pharmacy/collegeuseages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);
  const deleteCollageUsage = async (id) => {
    const response = await fetch(`${baseUrl}pharmacy/collegeuseages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بحذف هذا الإذن");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };
  const updateCollageUsage = async (collage, id) => {
    const response = await fetch(`${baseUrl}pharmacy/collegeuseages/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...collage,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بتعديل بيانات هذا الإذن");
      } else {
        toast.error("حدث خطأ ما");
      }
    }
    return response;
  };
  ////////////////////////////  End of Collage Usages Provider  ////////////////////////////

  ////////////////////////////  Start of Units Provider  ////////////////////////////
  const fetchLargeUnits = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/unit/max", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const addNewLargeUnit = async (unit) => {
    const params = new URLSearchParams({ name: unit });

    const response = await fetch(
      `${baseUrl}pharmacy/unit/max?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة وحدة جديدة");
      } else {
        toast.error("حدث خطأ ما");
      }
    }

    return response;
  };

  const fetchSmallUnits = useCallback(async () => {
    try {
      const response = await axiosApi.get(baseUrl + "pharmacy/unit/min", {
        headers: {
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const addNewSmallUnit = async (unit) => {
    const params = new URLSearchParams({ name: unit });

    const response = await fetch(
      `${baseUrl}pharmacy/unit/min?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(Cookies.get("user")).token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error("غير مصرح لك بإضافة وحدة جديدة");
      } else {
        toast.error("حدث خطأ ما");
      }
    }

    return response;
  };
  ////////////////////////////  End of Units Provider  ////////////////////////////
  return (
    <MedicineContext.Provider
      value={{
        items,
        setItems,
        handleNameOrCode,
        nameOrCode,
        setNameOrCode,
        getMedicines,
        medicineType,
        submitMedicine,
        suppliers,
        handleNewOrder,
        itemsWithCompany,
        MedicineByCategories,
        error,
        loading,
        setLoading,
        setError,
        FetchMedicineInfos,
        postNewSupplier,
        fetchOrders,
        wholeOrders,
        FetchOrderInfo,
        deleteMedicine,
        updateOrder,
        deleteOrder,
        fetchDiseases,
        addNewPatient,
        fetchPatients,
        FetchPatientInfo,
        updatePatient,
        updateMedicine,
        addNewDisease,
        suppliersHandler,
        addNewPrescription,
        medicineList,
        fetchPrescriptions,
        FetchPrescriptionInfo,
        deletePrescription,
        updatePrescription,
        fetchInventory,
        fetchNotifications,
        fetchPrices,
        notifications,
        setNotifications,
        notificationsData,
        setNotificationsData,
        fetchUsage,
        fetchUsageDetails,
        getMedicineType,
        addNewMedicineType,
        deleteUsage,
        fetchSales,
        fetchCollages,
        handleCollageUsage,
        fetchInventoryWithoutAll,
        fetchCollageUsage,
        fetchCollageUsageInfo,
        deleteCollageUsage,
        updateCollageUsage,
        fetchLargeUnits,
        addNewLargeUnit,
        fetchSmallUnits,
        addNewSmallUnit,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicinesProvider;
