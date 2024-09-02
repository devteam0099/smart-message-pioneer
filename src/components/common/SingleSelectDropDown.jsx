import React from "react";
import { useTranslation } from "react-i18next";

const SingleSelectDropDown = ({
  label,
  selectedOption,
  setIsOpen,
  isOpen,
  handleOptionClick,
  Options,
  defaultSelected,
  customClass,
  disabled,
  Severity,
  style,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`relative custom-dropdown grow !p-0 !w-[100%] mb-4 ${customClass} `}
    >
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {t(label)}
      </label>
      <div
        className={`dropdown-header  border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer !pr-[19px] ${
          disabled ? "!bg-[#efefef4d] !pointer-events-none" : ""
        } `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption
          ? Severity
            ? t(selectedOption?.value)
            : t(selectedOption?.label)
          : t(defaultSelected)}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>
      {isOpen && (
        <ul
          className="dropdown-list !absolute mt-1 bg-white border border-gray-300 rounded-md z-10"
          style={style}
        >
          {Options?.map((option) => (
            <li
              key={option.value}
              className="dropdown-item p-2 hover:bg-[#f3f5fb] cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {t(option.label)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleSelectDropDown;
