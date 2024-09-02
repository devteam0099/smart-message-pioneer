import React, { useEffect, useRef, useState } from "react";
import "./AccountManagement.css";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import InputTag from "../common/InputTag";
import { useTranslation } from "react-i18next";

const AccountManagementUpsert = ({
  setOpenModal,
  fetchAccounts,
  getAccountStats,
}) => {
  const { t } = useTranslation();
  const [environment, setEnvironment] = useState("ANDROID");
  const [accountType, setAccountType] = useState("personal");
  const [selectedCard, setSelectedCard] = useState("bulkUpload");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [accountSource, setAccountSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dropAreaRef = useRef(null);

  const Card = ({ title, description, iconName, selected, onSelect }) => {
    return (
      <div
        className={` p-4 border rounded-lg cursor-pointer w-[100%] ${
          selected ? "border-[#696cff]" : "border-gray-200"
        }`}
        onClick={onSelect}
      >
        <div className="flex justify-between w-full">
          <div className="mr-4">
            <SvgComponent name={iconName} />
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 ${
              selected ? "border-[#696cff]" : "border-gray-300"
            } flex items-center justify-center`}
          >
            {selected && (
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-semibold">{t(title)}</h3>
          <p className="text-sm text-gray-500">{t(description)}</p>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(" selectedMaterialOption?.value", selectedMaterialOption)
    try {
      let url;
      let method;
      let response;
      // selectedAccountID && formData.append("acc_id", selectedAccountID);

      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("business", accountType === "business" ? true : false);
        formData.append("device_type", environment);
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/bulk/upload`;
        method = "POST";
        response = await fetch(url, {
          method: method,
          body: formData,
          credentials: "include",
        });
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/upload`;
        method = "POST";
        const body = JSON.stringify({
          sixParts: accountSource,
          business: accountType === "business" ? true : false,
          device_type: environment,
        });
        response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body,
          credentials: "include",
        });
      }

      const data = await response.json();
      if (data?.code === 2039) {
        toast.success(`Account already exists`);
        setIsLoading(false);
      } else if (data?.code === 1000 || data?.code === 200) {
        toast.success(`Account created successfully`);
        fetchAccounts();
        getAccountStats();
        onClose();
        setIsLoading(false);
      } else {
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };

  const handleFileChange = (file) => {
    setUploadProgress(0);
    setFileError("");

    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      setFileError(t("Unsupported file format"));
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    // Simulate file upload
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(100);
    };

    xhr.onerror = () => {
      setIsUploading(false);
    };

    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.add("bg-gray-200");
  };

  const handleDragLeave = () => {
    dropAreaRef.current.classList.remove("bg-gray-200");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove("bg-gray-200");
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  useEffect(() => {
    setTimeout(() => {
      setFileError(false);
    }, 7000);
  }, [fileError]);
  useEffect(() => {
    setUploadedFile(null);
  }, [selectedCard]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] account-manage-upsert-container">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{t("Create Account")}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <div className="p-4 bg-[#F5F6FF] rounded-lg flex items-center justify-between w-full max-w-3xl mx-auto">
            {/* Account Environment Section */}
            <div className="flex items-center device-type-wrapper">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">
                  {t("Account Environment")}
                </h3>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="environment"
                      value="ANDROID"
                      className="hidden"
                      checked={environment === "ANDROID"}
                      onChange={() => setEnvironment("ANDROID")}
                    />
                    <span className="custom-radio mr-2"></span>
                    <span className="text-sm text-black">{t("Android")}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="environment"
                      value="IPHONE"
                      className="hidden"
                      checked={environment === "IPHONE"}
                      onChange={() => setEnvironment("IPHONE")}
                    />
                    <span className="custom-radio mr-2"></span>
                    <span className="text-sm text-black">
                      {t("iOS (Apple)")}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Type Section */}
            <div className="flex items-center device-type-wrapper">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">
                  {t("Account Type")}
                </h3>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="type"
                      value="personal"
                      className="hidden"
                      checked={accountType === "personal"}
                      onChange={() => setAccountType("personal")}
                    />
                    <span className="custom-radio mr-2"></span>
                    <span className="text-sm text-black">{t("Personal")}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="business"
                      className="hidden"
                      checked={accountType === "business"}
                      onChange={() => setAccountType("business")}
                    />
                    <span className="custom-radio mr-2"></span>
                    <span className="text-sm text-black">{t("Business")}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Card
              title="Bulk Upload"
              description="Files allowed: .XLSX, .CSV & .TXT"
              iconName="FolderIcon"
              selected={selectedCard === "bulkUpload"}
              onSelect={() => setSelectedCard("bulkUpload")}
            />
            <Card
              title="Add Account"
              description="Add an account by adding a string"
              iconName="FolderIcon"
              selected={selectedCard === "addAccount"}
              onSelect={() => setSelectedCard("addAccount")}
            />
          </div>
          {!uploadedFile && selectedCard === "bulkUpload" && (
            <div
              className="border-2 border-0 border-gray-300 rounded-[12px] p-4 mb-4 text-center bg-[#F3F5F7]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={dropAreaRef}
            >
              <input
                type="file"
                name="file-upload"
                className="hidden"
                id="file-upload"
                // accept=".xlsx, .csv, .txt, .png, .jpg, .jpeg, .gif, .mp4, .mp3, .wav"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500"
              >
                <div className="text-center flex flex-col gap-[8px] h-[160px] justify-center items-center">
                  <SvgComponent name={"uploadFileIcon"} />
                  <p>
                    {t("Drag & Drop File or ")}{" "}
                    <span className="text-blue-500">{t("Browse")}</span>
                  </p>
                  <p className="text-[12px] text-[#8E8E8E] ">
                    {t("Supported Formats: .XLXS, CSV & .TXT")}
                  </p>
                </div>
              </label>
            </div>
          )}
          {uploadedFile && !isUploading && selectedCard === "bulkUpload" && (
            <div className="border-2 border-0 border-gray-300 rounded-[12px] p-4 mb-4 text-center bg-[#F3F5F7]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-[10px]">
                  <SvgComponent name={"FolderIcon"} />
                  <div className="text-gray-700 flex flex-col">
                    {uploadedFile?.name}{" "}
                    <span className="text-gray-500 text-sm self-start">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <SvgComponent name={"SmDeleteIcon"} />
                </button>
              </div>
            </div>
          )}
          {isUploading && selectedCard === "bulkUpload" && (
            <div className="bg-[#F5F6FF] rounded-[12px] p-4 mb-4 flex items-center">
              <span className="text-gray-700">{uploadedFile?.name}</span>
              <div className="flex-grow ml-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                <SvgComponent name={"crossIcon"} />
              </button>
            </div>
          )}
          {selectedCard === "addAccount" && (
            <div className="w-full">
              <InputTag
                label={"Account Source"}
                value={accountSource}
                type="text"
                placeholder={"Add String"}
                onChange={(e) => setAccountSource(e.target.value)}
                required={selectedCard === "addAccount" ? true : false}
              />
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {t("Create")}
            </button>
          </div>
        </form>
        {fileError && (
          <div className="error-message text-red-500 mt-4">{fileError}</div>
        )}
      </div>
    </div>
  );
};

export default AccountManagementUpsert;
