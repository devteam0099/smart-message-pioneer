import React from "react";
import SvgComponent from "../../SvgComponent/SvgComponent";
import styles from "./statusCard.module.css";
import { useTranslation } from "react-i18next";

const Card = ({ icon, title, count, customClass }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`w-56 bg-white shadow-md rounded-xl p-3 flex items-center space-x-4 ${customClass}`}
    >
      <div className="flex-shrink-0">
        <SvgComponent name={icon} />
      </div>
      <div>
        <h3 className={styles.cardTitle}>{t(title)}</h3>
        <p className={styles.cardCount}>{count}</p>
      </div>
    </div>
  );
};

export default Card;
