import React, { useState } from "react";
import "./modal.css";
import SingleSelectDropDown from "../../../common/SingleSelectDropDown";
function ResetDataModal({ setOpenModal, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    // if (onSelect) onSelect(option);
  };
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
    { value: "5", label: "Option 5" },
    { value: "6", label: "Option 6" },
  ];

  // const onSelect = (option) => {
  //   console.log("Selected option:", option);
  // };

  const onUpdate = () => {
    if (selectedOption) {
      // console.log({ selectedOption });
      setOpenModal(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-[12px] p-6 w-96 w-[485px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-[#303030]">
            Reset the data
          </h2>
        </div>

        <div className="custom-dropdown">
          <div className="dropdown-header !pr-[19px]" onClick={toggleDropdown}>
            {selectedOption ? selectedOption : "Select an option"}
            <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
          </div>
          {isOpen && (
            <ul className="dropdown-list">
              {options.map((option) => (
                <li
                  key={option.value}
                  className="dropdown-item"
                  onClick={() => handleOptionClick(option.label)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button className="px-5 text-[#383A3B]" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onUpdate}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetDataModal;
