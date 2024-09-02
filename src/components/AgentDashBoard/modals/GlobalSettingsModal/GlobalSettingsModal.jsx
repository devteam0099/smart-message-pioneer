import React, { useState } from "react";
import "./GlobalSettingsModal.css";
import SvgComponent from "../../../SvgComponent/SvgComponent";
import SingleSelectDropDown from "../../../common/SingleSelectDropDown";

const GlobalSettingsModal = ({ setOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState([]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const handleMoreOptionClick = (option) => {
    console.log("options");
    // if (option === "Reset Data") {
    //   setresetModal(!resetModal);
    // }else{
    //   setGlobalSetingModal(!globalSettingModal)
    // }
  };
  const handleMoreModal = (index) => {
    setShowMoreModal((prev) => {
      const newState = new Array(prev.length).fill(false);
      newState[index] = !prev[index];
      return newState;
    });
  };
  const moreOptions = [
    { value: "1", label: "Edit" },
    { value: "2", label: "Assign" },
  ];
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
    { value: "5", label: "Option 5" },
    { value: "6", label: "Option 6" },
  ];

  const onClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] global-setting-modal">
      <div className="bg-white rounded-lg w-full max-w-[1000px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-[20px] font-semibold mb-4">Global Settings</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col space-y-2 gap[19px]">
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 text-base">
                Translation Settings
              </span>
              <input type="checkbox" className="toggle-checkbox" />
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 text-base">
                Hide Conversation translator icon
              </span>
              <input type="checkbox" className="toggle-checkbox" />
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <SingleSelectDropDown
              label={null}
              Options={options}
              handleOptionClick={handleOptionClick}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedOption={selectedOption}
              defaultSelected={"Select Global Translations"}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Bulk Editing
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[300px]">
          <table className="w-full rounded-[23px]">
            <thead className="sticky bg-[#F6F6FA] top-0 z-[2] rounded-[23px]">
              <tr className="text-left text-gray-500 text-[14px]">
                <th className="p-4">
                  <input type="checkbox" />
                </th>
                <th className="p-4">Agent ID</th>
                <th className="p-4">Agent Name</th>
                <th className="p-4">Translation Channels</th>
                <th className="p-4">Receive Translations</th>
                <th className="p-4">Send Translation</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="">
              {[...Array(13)].map((_, index) => (
                <tr key={index} className="bg-white">
                  <td className="p-4">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">#11212</td>
                  <td className="p-4">Liu Song</td>
                  <td className="p-4">Microsoft</td>
                  <td className="p-4">English</td>
                  <td className="p-4">English</td>
                  <td className="p-4 text-right">
                    <div className="relative flex items-center">
                      <button
                        className="relative"
                        onClick={() => handleMoreModal(index)}
                      >
                        <SvgComponent name={"seeMoreDots"} />
                      </button>
                      {showMoreModal[index] && (
                        <div className="absolute right-0 top-[40px] z-[2]">
                          <ul className="header-dropdown-list bg-white py-2 px-[2px] rounded-[8px] w-[140px] bg-[#F3F4F6] text-left">
                            {moreOptions.map((option) => (
                              <li
                                key={option.value}
                                className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                                onClick={() =>
                                  handleMoreOptionClick(option.label)
                                }
                              >
                                {option.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="h-[65px]"></tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button className="mr-4 text-gray-500">Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsModal;
