import React from "react";
import style from "./NotificationItem.module.css";
import { BsBellFill } from "react-icons/bs";
import { Button } from "react-bootstrap";

const NotificationItem = ({
  name,
  notification,
  listOrPage = "list",
  no = false,
}) => {
  if (listOrPage === "list") {
    return (
      <div className={style.notiItem}>
        {no === false ? (
          <div className={style.iconItem}>
            <BsBellFill style={{ width: "10px" }} fill="white" />
          </div>
        ) : (
          ""
        )}
        <p>
          {name} {notification}
        </p>
      </div>
    );
  } else {
    return (
      <div className={style.notificationItemPage}>
        <div className="d-flex gap-2 justify-content-center align-items-center ">
          <div className={style.iconItem}>
            <BsBellFill style={{ width: "10px" }} fill="white" />
          </div>
          <p>
            {name} {notification}
          </p>
        </div>
        <Button className="btn-danger-edited">يرجى إعادة طلب كمية جديدة</Button>
      </div>
    );
  }
};

export default NotificationItem;
