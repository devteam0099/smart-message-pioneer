import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SvgComponent from "../../../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { TagTypes } from "../../../../Utils/templateTypeEnum";
import SingleSelectDropDown from "../../../common/SingleSelectDropDown";

const CreateGroupModal = ({ setOpenModal }) => {
  const { t } = useTranslation();

  const [groupName, setGroupName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [tagOptions, setTagOptions] = useState([
    {
      label: "option 1",
      value: 1,
    },
    {
      label: "option 2",
      value: 2,
    },
    {
      label: "option 2",
      value: 3,
    },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropAreaRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setFileError(false);
    }, 5000);
  }, [fileError]);

  const onClose = () => {
    setOpenModal(false);
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/list?limit=&page_no=&name=&tag_type=${TagTypes?.CONTACTS}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data?.code === 200) {
        const tagOption = data?.data?.map((item) => ({
          label: item?.Name,
          value: item?.ID,
        }));
        setTagOptions(tagOption);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setFileError(t("Unsupported file format"));
      return;
    }
    // Process the form submission here
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{t("Create Group")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[20px] ">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Group Name")}
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={t("Enter group name")}
                required
              />
            </div>
            <SingleSelectDropDown
              label={t("Group Name")}
              Options={tagOptions}
              handleOptionClick={handleOptionClick}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedOption={selectedOption}
              defaultSelected={t("chooseGroup")}
            />
          </div>
          {!uploadedFile && (
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
          {uploadedFile && !isUploading && (
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
          {isUploading && (
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
          {/* {!uploadedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-[12px] p-4 mb-4 text-center bg-[#F5F6FF]"
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
                accept=".xlsx, .csv, .txt"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500"
              >
                <div className="text-center flex flex-col gap-[20px] h-[160px] justify-center items-center">
                  <SvgComponent name={"uploadFileIcon"}/>
                  <p>Drag & Drop File or <span className="text-blue-500">Browse</span></p>
                  <p className="text-gray-500 text-sm mt-1">Supported Formats: .XLSX, CSV & .TXT</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-[12px] p-4 mb-4 text-center bg-[#F5F6FF]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{uploadedFile.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Change File
                </button>
              </div>
            </div>
          )} */}
          <div className="flex justify-end">
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
        {fileError && <div className="error-message">{fileError}</div>}
      </div>
    </div>
  );
};

export default CreateGroupModal;
