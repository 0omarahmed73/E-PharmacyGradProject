import { Button, Col, Row } from "react-bootstrap";
import style from "./Page404.module.css";
import { BiSolidErrorAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className={style.Page404}>
      <div className="d-flex align-items-center flex-lg-row flex-column  ">
      <div className={style.img}>
          <img src="/4042.svg" alt="" />
        </div>
        <div className={style.first}>
          <h1 className="text-main" style={{ fontSize: "30px" }}>
            عفواً , الصفحة المطلوبة غير متوفرة{" "}
          </h1>
          <Button
            className="btn-main mt-2 ms-auto"
            onClick={() => navigate("/", { replace: true })}
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Page404;
