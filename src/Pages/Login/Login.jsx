import Form from "react-bootstrap/Form";
import Input from "../../components/input/Input";
import { AiFillLock } from "react-icons/ai";
import { FaHashtag, FaUserAlt } from "react-icons/fa";
import { Container } from "react-bootstrap";
import style from "./Login.module.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonSubmit from "./../../components/ButtonSubmit";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { ShowContext } from "../../context/ShowContext";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
const Login = () => {
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 500);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useDocumentTitle("تسجيل الدخول");
  const { login, loading } = useContext(AuthContext);
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("الرجاء ادخال اسم المستخدم"),
      password: yup.string().required("الرجاء التاكد من ادخال كلمة المرور"),
    }),
    onSubmit: (values) => login(values),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={style.login}
    >
      {spinner && spinnerElement}
      <Container className="d-flex vh-100 flex-md-row align-items-center ">
        <div className={`${style.right} m-auto `}>
          <h5 className="text-black mb-3">مرحبا بكم</h5>
          <Form onSubmit={formik.handleSubmit}>
            <Input
              className="text-end"
              error={formik.errors.email}
              touched={formik.touched.email}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
              width={"100%"}
              label="إسم المستخدم"
              type="text"
              id="email"
              name="email"
              icon={<FaUserAlt />}
            />
            <Input
              error={formik.errors.password}
              onBlur={formik.handleBlur}
              touched={formik.touched.password}
              value={formik.values.password}
              onChange={formik.handleChange}
              width={"100%"}
              className="mt-2"
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              icon={
                <span
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaHashtag /> : <AiFillLock />}
                </span>
              }
            />
            <div className="coll mt-2 d-flex flex-row justify-content-between align-items-center">
              <ButtonSubmit
                type="submit"
                className="btn-main btn"
                disabled={!formik.isValid || loading}
              >
                {loading ? "جاري التحميل..." : "تسجيل الدخول"}
              </ButtonSubmit>
              <Link className="m-0" href="#">
                نسيت كلمة المرور
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </motion.div>
  );
};

export default Login;
