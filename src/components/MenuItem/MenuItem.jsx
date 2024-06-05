import { Link } from "react-router-dom";
import style from "./MenuItem.module.css";

const MenuItem = ({
  title,
  icon = "",
  padding = "20px",
  pt,
  to = "/",
  isLink = true,
  children,
  className,
}) => {
  if (isLink) {
    return (
      <Link
        to={to}
        className={`${style.rectangle2} ${pt} ${className} text-decoration-none `}
        style={{ paddingBlock: padding }}
      >
        <div className={style.image2} alt="">
          {icon}
        </div>
        <p className={`${style.te2} m-0`}>
          <strong>{title}</strong>
        </p>
      </Link>
    );
  } else {
    return (
      <div
        className={`${style.rectangle2} ${pt} text-decoration-none `}
        style={{ paddingBlock: "10px" }}
      >
        <div className={style.image2} alt="">
          {icon}
        </div>
        <div className={`${style.te2} text-center  m-0`}>
          <h5 className="fw-bold mt-0 pt-0">{children}</h5>
          <p className="m-0 p-0">{title}</p>
        </div>
      </div>
    );
  }
};

export default MenuItem;
