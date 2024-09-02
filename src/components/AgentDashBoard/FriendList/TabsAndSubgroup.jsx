import React, { useState } from "react";
import style from "./FriendList.module.css";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const TabsAndSubgroup = ({
  setShowMaterialTagUpsert,
  searchOptions,
  setIsSearchOptionsOpen,
  isSearchOptionsOpen,
  handleSearchOptionClick,
  selectedSearchOption,
  setSearchInput,
  searchInput,
}) => {
  const [activeTab, setActiveTab] = useState("friends");
  const { t } = useTranslation(); // Initialize useTranslation hook

  return (
    <>
      <div
        className={`flex bg-gray-200 p-1 border-radius-10 ${style.tabsAndGroupContainer}`}
      >
        <button
          className={`flex-1 text-xs p-2.5 border-radius-8 ${
            activeTab === "friends" ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          {t("Friends List")}
        </button>
        <button
          className={`flex-1 text-xs p-2.5 border-radius-8 ${
            activeTab === "groups" ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          {t("Group List")}
        </button>
      </div>
      <div className={`flex space-x-2 text-xs ${style.subGroupWrapper}`}>
        <div className="relative custom-dropdown grow !p-0 !w-[50%]">
          <div
            className="bg-[#EEF2FE] p-2 flex justify-between items-center cursor-pointer"
            onClick={() => setIsSearchOptionsOpen(!isSearchOptionsOpen)}
          >
            {t(selectedSearchOption?.label)}
            <span
              className={`dropdown-arrow ${
                isSearchOptionsOpen ? "open" : ""
              } !p-[3px]`}
            ></span>
          </div>
          {isSearchOptionsOpen && (
            <ul className="dropdown-list !absolute mt-1 bg-white border border-gray-300 rounded-md z-10">
              {searchOptions?.map((option) => (
                <li
                  key={option.value}
                  className="dropdown-item p-2 hover:bg-[#f3f5fb] cursor-pointer"
                  onClick={() => handleSearchOptionClick(option)}
                >
                  {t(option.label)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          value={searchInput}
          type="text"
          placeholder={t("searchPlaceholder", {
            selectedSearchOption: t(selectedSearchOption?.label),
          })}
          className="p-2 border border-radius-8 flex-grow border-none"
          onChange={(e) => setSearchInput(e?.target?.value)}
        />
      </div>
      <div className="flex space-x-2 text-xs">
        <button
          className={`py-2 px-4 border-radius-8 flex-grow ${style.addSubGroupbtn}`}
          onClick={() => setShowMaterialTagUpsert(true)}
        >
          {t("Add Group")}
        </button>
        <button
          className={`py-2 px-4 border-radius-8 ${style.resetGroupbtn}`}
          onClick={() => setSearchInput("")}
        >
          {t("Reset")}
        </button>
      </div>
    </>
  );
};

export default TabsAndSubgroup;
