import React, { useState, useRef, useEffect } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import MediaTypes, { TagTypes } from "../../Utils/templateTypeEnum";
import SingleSelectDropDown from "../common/SingleSelectDropDown";
import { useTranslation } from "react-i18next";

const TemplateUpsert = ({
  selectedType,
  setOpenModal,
  tagOptions,
  fetchMedia,
  templateId,
  tagId,
  setTemplateId,
  tagType,
  modalTitle,
  templateTitle,
  tagTitle,
  materialOptions,
  handleMaterialOptionClick,
  isMaterialOptionsOpen,
  setIsMaterialOptionsOpen,
  selectedMaterialOption,
  setSelectedMaterialOption,
}) => {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setFileError(false);
    }, 5000);
  }, [fileError]);
  const onClose = () => {
    setOpenModal(false);
    setTemplateId && setTemplateId(null);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  // function formatBytes(bytes, decimals = 2) {
  //   if (bytes === 0) return '0 MB';
  //   const mb = bytes / (1024 * 1024); // Convert bytes to MB
  //   return parseFloat(mb.toFixed(decimals)) + ' MB';
  // }

  const fetchSingletemplate = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/template?temp_id=${templateId}`,
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
      if (data?.code === 1000) {
        // console.log("data?.data", data?.data, data?.data?.Tags?.[0]);
        const splitUrl = data?.data?.Content?.split("/");
        const extractedFilename = splitUrl[splitUrl.length - 1];
        // console.log("extractedFilename", extractedFilename);
        if (selectedType !== MediaTypes?.TEXT) {
          // const response = await fetch(data?.data?.content, {
          //   method: 'HEAD',
          //   mode: 'no-cors'
          // });
          // const contentLength = response.headers.get('Content-Length');

          // if (!contentLength) {
          //   console.error('Content-Length header is missing');
          // }

          // const sizeInBytes = parseInt(contentLength, 10);
          setUploadedFile({
            name: extractedFilename,
            url: data?.data?.Content,
            // size: sizeInBytes
          });
          // const size = await formatBytes(sizeInBytes);
        }
        setGroupName(data?.data?.Name);
        const filtered = tagOptions?.filter((el) => {
          // console.log("ele", el);
          return el?.value === data?.data?.Tags?.[0]?.ID;
        });
        // console.log("filtered[0]", filtered);

        setSelectedOption(filtered[0]);
        selectedType === MediaTypes?.TEXT &&
          setMessageValue(data?.data?.Content);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    if (templateId) {
      // console.log("first");
      fetchSingletemplate();
    }
  }, [templateId]);
  const handleDragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.add("drag-over");
  };

  const handleDragLeave = () => {
    dropAreaRef.current.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
    dropAreaRef.current.classList.remove("drag-over");
  };
  // useEffect(() => {}, [templateId, tagId]);
  const handleFileChange = (file) => {
    setUploadProgress(0);
    setFileError("");

    if (!file) return;

    const allowedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ];

    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/mkv",
      "video/x-matroska",
    ];

    const allowedAudioTypes = ["audio/mpeg", "audio/wav"];
    // console.log("file.type", file.type);
    if (tagType === TagTypes?.CUSTOM_TEXT_TO_SPEECH) {
      if (selectedMaterialOption?.value === MediaTypes?.IMAGE) {
        if (!allowedImageTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      } else if (selectedMaterialOption?.value === MediaTypes?.VIDEO) {
        if (!allowedVideoTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      } else if (selectedMaterialOption?.value === MediaTypes?.VOICE) {
        if (!allowedAudioTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      }
    } else {
      if (selectedType === MediaTypes?.IMAGE) {
        if (!allowedImageTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      } else if (selectedType === MediaTypes?.VIDEO) {
        if (!allowedVideoTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      } else if (selectedType === MediaTypes?.VOICE) {
        if (!allowedAudioTypes.includes(file.type)) {
          setFileError(t("Unsupported file format"));
          return;
        }
      }
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
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(" selectedMaterialOption?.value", selectedMaterialOption)
    try {
      let url;
      let method;
      if (templateId) {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/template/update`;
        method = "PUT";
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/template/create`;
        method = "POST";
      }
      if (
        ["Voice", "Video", "Image"].includes(selectedType) &&
        !uploadedFile &&
        selectedMaterialOption?.value !== MediaTypes?.TEXT
      ) {
        setFileError("Upload file is required for selected type.");
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", groupName);
      uploadedFile &&
        formData.append(
          "content",
          uploadedFile?.url ? uploadedFile?.url : uploadedFile
        );
      messageValue && formData.append("content", messageValue);
      if (tagType === TagTypes?.CUSTOM_TEXT_TO_SPEECH) {
        formData.append(
          "template_type",
          selectedMaterialOption?.value?.toUpperCase()
        );
      } else {
        formData.append("template_type", selectedType.toUpperCase());
      }
      formData.append("category", tagType);
      selectedOption?.value && formData.append("tag_id", selectedOption?.value);
      templateId && formData.append("template_id", templateId);
      const response = await fetch(url, {
        method: method,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (data?.code === 1000 || data?.code === 200) {
        fetchMedia();
        // setTimeout(() => {
        toast.success(
          `Template ${templateId ? "updated" : "created"} successfully`
        );
        onClose();
        setIsLoading(false);
        // }, 3000);
      } else {
        toast.error("Failed to create template");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
      setIsLoading(false);
    }
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
        <h2 className="text-xl font-semibold mb-4">
          {/* Add {selectedType} */}
          {t(modalTitle)}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[20px] ">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {/* {selectedType} name */}
                {t(templateTitle)}
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={
                  tagType === TagTypes?.CUSTOM_TEXT_TO_SPEECH
                    ? t("Enter material name")
                    : t(`Enter ${selectedType} template name`)
                }
                required
              />
            </div>
            <SingleSelectDropDown
              label={tagTitle}
              Options={tagOptions}
              handleOptionClick={handleOptionClick}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedOption={selectedOption}
              defaultSelected={
                selectedOption
                  ? selectedOption?.label
                  : tagType === TagTypes?.CUSTOM_TEXT_TO_SPEECH
                  ? "Choose Group"
                  : "Material Tags"
              }
            />
          </div>
          {tagType === TagTypes?.CUSTOM_TEXT_TO_SPEECH && (
            <SingleSelectDropDown
              label={"Material Name"}
              Options={materialOptions}
              handleOptionClick={handleMaterialOptionClick}
              isOpen={isMaterialOptionsOpen}
              setIsOpen={setIsMaterialOptionsOpen}
              selectedOption={selectedMaterialOption}
              defaultSelected={
                selectedMaterialOption
                  ? selectedMaterialOption?.label
                  : "Choose Material"
              }
              customClass={"!w-[50%]"}
            />
          )}
          {!uploadedFile &&
            (selectedMaterialOption?.value
              ? selectedMaterialOption?.value !== MediaTypes?.TEXT
              : selectedType !== MediaTypes?.TEXT) && (
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
                  <div className="text-center flex flex-col gap-[20px] h-[160px] justify-center items-center">
                    <SvgComponent name={"uploadFileIcon"} />
                    <p>
                      {t("Drag & Drop File or")}{" "}
                      <span className="text-blue-500">{t("Browse")}</span>
                    </p>
                  </div>
                </label>
              </div>
            )}
          {(selectedMaterialOption?.value
            ? selectedMaterialOption?.value === MediaTypes?.TEXT
            : selectedType === MediaTypes?.TEXT) && (
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Material Type")}
              </label>
              <textarea
                // type="text"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full h-[190px]"
                placeholder={t("Write your message here...")}
                required={
                  selectedMaterialOption?.value === MediaTypes?.TEXT ||
                  selectedType === MediaTypes?.TEXT
                    ? true
                    : false
                }
                maxLength={300}
              />
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
              {isLoading ? (
                <>
                  <i class="fa fa-circle-o-notch fa-spin mr-1"></i>
                  {t("Processing")}
                </>
              ) : templateId || tagId ? (
                t("Edit")
              ) : (
                t("Create")
              )}
            </button>
          </div>
        </form>
        {fileError && <div className="error-message">{fileError}</div>}
      </div>
    </div>
  );
};

export default TemplateUpsert;
