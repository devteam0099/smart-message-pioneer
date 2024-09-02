import React from "react";
import { useTranslation } from "react-i18next";

const InputTag = ({
  label,
  type,
  value,
  setValue,
  placeholder,
  required,
  customClass,
  onChange,
  disabled,
  style,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t(label)}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`activeInput ${
          customClass ? customClass : "p-2 border-2 rounded-[8px] mb-4 w-full "
        }`}
        placeholder={t(placeholder)}
        required={required}
        disabled={disabled}
        style={style}
      />
    </>
  );
};

export default InputTag;
