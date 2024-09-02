import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ items }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBreadcrumbClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        {items.map((item, index) => {
          const label = typeof item === "string" ? item : item.label;
          const route = typeof item === "object" ? item.route : null;

          return (
            <React.Fragment key={index}>
              <span
                className={`cursor-pointer text-gray-${
                  index === items?.length - 1 ? "800 font-semibold" : "500"
                } ${route ? "hover:text-blue-500" : ""}`}
                onClick={() => handleBreadcrumbClick(route)}
              >
                {t(label)}
              </span>
              {index < items?.length - 1 && (
                <span className="text-gray-500">&gt;</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BreadCrumbs;
