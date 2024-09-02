import React, { useState } from "react";
import avatar from "../../Assets/user.png";
import SvgComponent from "../SvgComponent/SvgComponent";
import "./ProfileSettings.css";
import { useFollowerContext } from "../../Utils/Context/Context";
import SingleSelectDropDown from "../common/SingleSelectDropDown";
import { toast } from "react-toastify";
import { clearCookie, handleLocalStorageClear } from "../../Utils/helper";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumbs from "../common/BreadCrumbs";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { profileData, setProfileData } = useFollowerContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(profileData?.fullname);
  const [email, setEmail] = useState(profileData?.email);
  const [country, setCountry] = useState(profileData?.country || "");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState([
    {
      label: "Unknown",
      value: "Unknown",
    },
    {
      label: "Male",
      value: "Male",
    },
    {
      label: "Female",
      value: "Female",
    },
  ]);
  const [selectedOption, setSelectedOption] = useState(
    profileData?.gender || tagOptions[0]
  );
  const breadcrumbItems = [
    { label: location.pathname.includes("admin") ? "Admin" : "User" },
    { label: "Settings" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleDeactivateClick = async (e) => {
    e.preventDefault();
    if (isChecked) {
      const body = {
        id: profileData?.id,
        is_active: false,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
          }
        );
        const data = await response?.json();
        if (data?.code === 1000 || data?.code === 200) {
          toast.success(t("Profile deactivated successfully!"));
          setIsLoading(false);
          clearCookie("auth_session");
          handleLocalStorageClear();
          navigate("/");
        } else {
          toast.error(data?.data || t("Error updating profile!"));
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(error?.message);
        console.error(t("Error updating profile:"), error);
      }
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const body = {
      id: profileData?.id,
      email,
      fullname: firstName,
      gender: selectedOption?.value?.toUpperCase(),
      is_active: true,
    };
    if (password) {
      body.password = password;
    }
    if (country) {
      body.country = country;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          credentials: "include",
        }
      );
      const data = await response?.json();
      if (data?.code === 1000 || data?.code === 200) {
        toast.success(t("User updated successfully!"));
        setIsLoading(false);
        localStorage.setItem(
          "profile",
          JSON.stringify({
            id: profileData?.id,
            email,
            fullname: firstName,
            gender: selectedOption,
            is_active: true,
            role: profileData?.role,
            country: country,
          })
        );
        setProfileData({
          id: profileData?.id,
          email,
          fullname: firstName,
          gender: selectedOption,
          is_active: true,
          role: profileData?.role,
          country: country,
        });
      } else {
        toast.error(data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.message);
      console.error(t("Error updating profile:"), error);
    }
  };

  return (
    <div className="profile-settings-container">
      {profileData?.role !== "AGENT" && (
        <div className="flex items-center justify-between mb-4">
          <BreadCrumbs items={breadcrumbItems} />
        </div>
      )}
      <div className=" mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t("Profile Settings")}</h2>
          <button
            className={`flex items-center gap-[5px] text-gray-500 hover edit-profile-wrap ${
              isEditable ? "editable" : ""
            } `}
            onClick={toggleEditMode}
          >
            <SvgComponent name={"editProfileIcon"} />
            <span
              className={`mr-2 ${
                isEditable ? "text-[#9E9E9E]" : "text-[#696CFF]"
              }`}
            >
              {t("Edit Profile")}
            </span>
          </button>
        </div>
        <div className="mb-4">
          <img
            src={avatar}
            alt={t("Profile")}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="flex space-x-6">
          <div className="flex-grow">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">
                  {t("Full Name")}
                </label>
                <input
                  type="text"
                  placeholder={t("First Name")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full activeInput "
                  disabled={!isEditable}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  {t("Email")}
                </label>
                <input
                  type="text"
                  placeholder={t("Email")}
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full activeInput "
                  disabled={!isEditable}
                />
              </div>
              <SingleSelectDropDown
                label={"Gender"}
                Options={tagOptions}
                handleOptionClick={handleOptionClick}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedOption={selectedOption}
                disabled={!isEditable}
              />
              <div>
                <label className="block text-sm font-medium">
                  {t("Country")}
                </label>
                <input
                  type="text"
                  placeholder={t("Enter Country")}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full activeInput "
                  disabled={!isEditable}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  {t("Password")}
                </label>
                <input
                  type="password"
                  placeholder={t("Enter Password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full activeInput "
                  disabled={!isEditable}
                />
              </div>
            </div>
            {isEditable && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {t("Save")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!location.pathname.includes("admin") && (
        <div className=" mt-4 mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Delete Account")}</h2>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="confirmDeactivation"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="confirmDeactivation" className="text-sm">
              {t("I confirm my account deactivation")}
            </label>
          </div>
          <button
            onClick={handleDeactivateClick}
            className={`px-4 py-2 rounded-lg text-white ${
              isChecked
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isChecked}
          >
            {t("Deactivate Account")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
