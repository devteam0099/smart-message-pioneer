import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.css";
import SvgComponent from "../SvgComponent/SvgComponent.jsx";
import ResetDataModal from "../AgentDashBoard/modals/resetModal/ResetDataModal.jsx";
import GlobalSettingsModal from "../AgentDashBoard/modals/GlobalSettingsModal/GlobalSettingsModal.jsx";
import CreateGroupModal from "../AgentDashBoard/modals/CreateGroupModal/CreateGroupModal.jsx";
import { useFollowerContext } from "../../Utils/Context/Context.js";
import { clearCookie, handleLocalStorageClear } from "../../Utils/helper.js";
import CreateContactModal from "../AgentDashBoard/modals/CreateContactModal/CreateContactModal.jsx";
import { toast } from "react-toastify";

const Header = () => {
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setArrowDropDown(!arrowDropDown);
  };
  const navigate = useNavigate();
  const { profileData, setProfileData } = useFollowerContext();
  const [resetModal, setresetModal] = useState(false);
  const [globalSettingModal, setGlobalSetingModal] = useState(false);
  const [headerModal, setHeaderModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCreateContacModal, setShowCreateContactModal] = useState(false);
  const [arrowDropDown, setArrowDropDown] = useState(false);
  const { selectedAccountID } = useFollowerContext();

  const handleModal = () => {
    setHeaderModal(!headerModal);
  };

  const options = [
    { value: "1", label: t("Global Settings") },
    { value: "2", label: t("Reset Data") },
  ];

  const handleOptionClick = (option) => {
    if (option === t("Reset Data")) {
      setresetModal(!resetModal);
    } else {
      setGlobalSetingModal(!globalSettingModal);
    }
  };

  const handleLogout = () => {
    setArrowDropDown(!arrowDropDown);
    clearCookie("auth_session");
    setProfileData(null);
    handleLocalStorageClear();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-white px-2.5 py-5 shadow-md">
      <div className="flex items-center">
        <img
          src={require("../../Assets/logo4.png")}
          alt="Logo"
          className="h-8 mr-2"
        />
        <span className="text-xl font-semibold">
          {t("Smart Message Pioneer")}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {window.location.pathname.includes("dashboard") && (
          <>
            <div className={styles.statusBtns}>
              <button
                className={`bg-green-100 text-green-800 px-3 py-1 ${styles.activeStatusBtn} online-btn`}
              >
                {t("Online")}
              </button>
              <button className="px-3 py-1 offline-btn">{t("Offline")}</button>
            </div>
            <button
              className="relative"
              onClick={() => {
                if (selectedAccountID) {
                  setShowCreateGroupModal(!showCreateGroupModal);
                } else {
                  toast.error(t("Please select an account!"));
                }
              }}
            >
              <SvgComponent name={"addBulkFriendsIcon"} />
            </button>
            <button
              className="relative"
              onClick={() => {
                if (selectedAccountID) {
                  setShowCreateContactModal(!showCreateContacModal);
                } else {
                  toast.error(t("Please select an account!"));
                }
              }}
            >
              <SvgComponent name={"addSingleFriend"} />
            </button>
          </>
        )}
        <div className="relative flex items-center">
          {window.location.pathname.includes("dashboard") ? (
            <button className="relative" onClick={handleModal}>
              <SvgComponent name={"seeMoreDots"} />
            </button>
          ) : (
            <button className="relative">
              <SvgComponent name={"NotificationIcon"} />
            </button>
          )}
          {headerModal && (
            <div className="absolute right-0 top-[40px] z-[5]">
              <ul className="header-dropdown-list bg-white py-2 px-[2px] rounded-[8px] w-[140px]">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                    onClick={() => handleOptionClick(option.label)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <img
          src={require("../../Assets/user.png")}
          alt="Profile"
          className="h-8 w-8 rounded-full !ml-8"
        />
        <div className="relative !ml-2">
          <button
            className="flex items-center"
            onClick={() => setArrowDropDown(!arrowDropDown)}
          >
            <span className="ml-2">{profileData?.fullname}</span>
            <span className="ml-2">
              <SvgComponent name={"downArrow"} />
            </span>
          </button>
          <div
            className={`absolute right-0 mt-2 bg-white shadow-lg rounded-xl z-[5] ${
              arrowDropDown ? "visible" : "hidden"
            }`}
          >
            <ul className="header-dropdown-list bg-white py-2 px-[2px] rounded-[8px] w-[140px]">
              <li
                className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                onClick={() => {
                  setArrowDropDown(!arrowDropDown);
                  const route =
                    profileData?.role === "ADMIN"
                      ? "/admin/settings"
                      : profileData?.role === "USER"
                      ? "/settings"
                      : "/profile";
                  navigate(route);
                }}
              >
                {t("Profile")}
              </li>
              <li
                className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                onClick={handleLogout}
              >
                {t("Logout")}
              </li>
              <li
                className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                onClick={() => handleLanguageChange("zh")}
              >
                中文
              </li>
              <li
                className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                onClick={() => handleLanguageChange("en")}
              >
                English
              </li>
            </ul>
          </div>
        </div>
      </div>
      {resetModal && <ResetDataModal setOpenModal={setresetModal} />}
      {globalSettingModal && (
        <GlobalSettingsModal setOpenModal={setGlobalSetingModal} />
      )}
      {showCreateGroupModal && (
        <CreateGroupModal setOpenModal={setShowCreateGroupModal} />
      )}
      {showCreateContacModal && (
        <CreateContactModal setOpenModal={setShowCreateContactModal} />
      )}
    </header>
  );
};

export default Header;
