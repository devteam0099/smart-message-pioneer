import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import MediaTypes from "../../Utils/templateTypeEnum";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ImagePreviewModal from "./ImagePreviewModal";
import { truncateText } from "../../Utils/helper";
import CustomAudioPlayer from "./CustomAudioPlayer";
import VideoPreviewModal from "./VideoPreviewModal";
import "./common.css";
import { useTranslation } from "react-i18next";

const CommonTable = ({
  headers,
  data,
  moreOptions,
  selectedType,
  setOpenModal,
  noDataIcon,
  setId,
  setSelectedIds,
  selectedIds,
  handleDelete,
  module,
  setAssignModal,
  toggleSwitch,
  tag,
  icon,
  noDataHeading,
  noDatastatement
}) => {
  const { t } = useTranslation();
  const [showMoreModal, setShowMoreModal] = useState(
    Array(data?.length)?.fill(false)
  );
  const [imageModal, setImageModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);


  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      const allIds = data?.map((row) => row.ID);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
// adds the single element id if it is not and remove it if it exists
  const handleSelect = (e, id) => {
    if (e?.target?.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  useEffect(() => {
    setShowMoreModal(Array(data?.length)?.fill(false));
    setSelectedIds([]);
  }, []);

  const handleMoreModal = (index) => {
    setShowMoreModal((prev) => {
      const newState = new Array(prev?.length).fill(false);
      newState[index] = !prev[index];
      return newState;
    });
  };

  const handleMoreOptionClick = async (selectedData,option, rowIndex) => {
    const rowId = data[rowIndex]?.ID;
    if (option === "Delete" || option === "Edit") {
      if (!rowId) {
        toast.error(`Invalid ${module} ID`);
        return;
      }
      const res = await handleDelete(selectedData,option,rowId);
      if (res) {
        setShowMoreModal((prev) => {
          const newState = [...prev];
          newState[rowIndex] = !newState[rowIndex];
          return newState;
        });
      }
    } else if (option === "Assign" || option === "Unassign") {
      setAssignModal && setAssignModal(true);
      setId(rowId);} else {
         setId(rowId);
        setOpenModal(true);
      } 
    setShowMoreModal(Array(data.length).fill(false));
  };
  return (
    <div className="overflow-auto mb-[50px] table-list-container text-center common-table-list-container mt-6">
      <table className="w-full rounded-[23px]">
        <thead className="sticky bg-[#F6F6FA] top-0 z-[2] rounded-[23px]">
          <tr className="text-left text-gray-500 text-[14px] border-b border-gray-300 text-center">
            {!module?.includes("Admin") && (
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    data?.length > 0
                      ? selectedIds?.length === data?.length
                      : false
                  }
                />
              </th>
            )}
            {headers.map((header, index) => (
              <th key={index} className="p-4">
                {t(header)}
              </th>
            ))}
            {!module?.includes("Admin") && <th className="p-4"></th>}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 &&
            data?.map((row, rowIndex) => {
              const options =
                module === "Account"
                  ? row?.assignedAgent?.Id
                    ? [
                        { value: "1", label: "Unassign" },
                        { value: "2", label: "Delete" },
                      ]
                    : [
                        { value: "1", label: "Assign" },
                        { value: "2", label: "Delete" },
                      ]
                  : moreOptions;
              return (
                <tr key={row?.ID} className="bg-white border-b border-gray-300">
                  {!module?.includes("Admin") && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelect(e, row?.ID)}
                        checked={selectedIds?.includes(row?.ID)}
                      />
                    </td>
                  )}
                  {headers?.map((header, colIndex) => {
                    let cellContent;

                    if (
                      header === "Image Template" &&
                      selectedType === MediaTypes?.IMAGE
                    ) {
                      cellContent = row[header] ? (
                        <div className="flex items-center gap-[10px] justify-center">
                          <img
                            src={row[header]}
                            alt="Image"
                            className="w-12 h-12 object-cover rounded-[8px] cursor-pointer"
                            onClick={() => {
                              setImageSrc(row[header]);
                              setImageModal(true);
                            }}
                          />
                          {/* <span>{row["Name"]}</span> */}
                        </div>
                      ) : (
                        // </div>
                        "No Image"
                      );
                    } else if (
                      header === "Video Template" &&
                      selectedType === MediaTypes?.VIDEO
                    ) {
                      cellContent = row[header] ? (
                        <div
                          className="flex items-center gap-[10px] justify-center cursor-pointer w-[110px] relative video-container"
                          onClick={() => {
                            setImageSrc(row[header]);
                            setVideoModal(true);
                          }}
                        >
                          <video
                            // controls
                            // className="w-32 h-24 rounded-[8px] cursor-pointer"
                            className="rounded-[8px] cursor-pointer w-[100%] h-[100%] "
                            key={row[header]}
                          >
                            <source src={row[header]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          {/* <span>{row["Name"]}</span> */}
                          <span className="absolute LargePlayVideoIcon">
                            <SvgComponent name={"LargePlayVideoIcon"} />
                          </span>
                        </div>
                      ) : (
                        "No Video"
                      );
                    } else if (
                      header === "Voice Template" &&
                      selectedType === MediaTypes?.VOICE
                    ) {
                      cellContent = row[header] ? (
                        // <audio
                        //   controls
                        //   className="inline-block"
                        //   key={row[header]}
                        // >
                        //   <source src={row[header]} type="audio/mpeg" />
                        //   Your browser does not support the audio element.
                        // </audio>
                        <CustomAudioPlayer audioSrc={row[header]} />
                      ) : (
                        "No Audio"
                      );
                    } else if (header === "Text Template") {
                      const fullText = row[header] || "N/A";
                      const textClass =
                        fullText?.length >= 50
                          ? `my-anchor-element${rowIndex}`
                          : "";
                      cellContent = (
                        <>
                          <div className={textClass}>
                            {truncateText(fullText, 50)}
                          </div>
                          <Tooltip
                            anchorSelect={`.my-anchor-element${rowIndex}`}
                            place="top"
                            clickable
                            style={{
                              left: "0px",
                              borderRadius: "8px",
                            }}
                          >
                            {fullText}
                          </Tooltip>{" "}
                        </>
                      );
                    } else if (
                      header === "Status" &&
                      !module.includes("Admin")
                    ) {
                      const status = row[header] || "N/A";
                      const statusClass =
                        status === "online"
                          ? "status-indicator status-online text-[green]"
                          : "status-indicator status-offline text-[red]";

                      cellContent = (
                        <div className={statusClass}>{t(status)}</div>
                      );
                    } else if (
                      header === "Status" &&
                      module.includes("Admin")
                    ) {
                      cellContent = (
                        <div
                          onClick={() => {
                            if (row["Role"] === "ADMIN") {
                              return;
                            }
                          }}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                            row["Role"] === "ADMIN"
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } ${row[header] ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              row[header] ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      );
                    } else {
                      cellContent = row[header] || "N/A";
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`p-4 ${
                          header === "Text Template" ? "relative" : ""
                        } ${header === "Voice Template" ? "w-[294px]" : ""} ${
                          header === "Status" && module.includes("Admin")
                            ? "flex justify-center"
                            : ""
                        }  ${
                          header === "Video Template"
                            ? "flex justify-center"
                            : ""
                        } `}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {!module?.includes("Admin") && (
                    <td className="p-4 text-right">
                      <div className="relative flex items-center">
                        <button onClick={() => handleMoreModal(rowIndex)}>
                          <SvgComponent name={"seeMoreDots"} />
                        </button>
                        {showMoreModal[rowIndex] && (
                          <div className="absolute right-0 top-[40px] z-[2]">
                            <ul className="header-dropdown-list bg-white py-2 px-[2px] rounded-[8px] w-[140px] bg-[#F3F4F6] text-left">
                              {options?.map((option) => (
                                <li
                                  key={option.value}
                                  className="p-2 hover:bg-[#ECEDFF] m-1 text-[14px] rounded-[8px] cursor-pointer"
                                  onClick={() =>
                                    handleMoreOptionClick(
                                      row,
                                      option.label,
                                      rowIndex
                                    )
                                  }
                                >
                                  {t(option.label)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          <tr className="h-[65px]"></tr>
        </tbody>
      </table>
      {!data?.length > 0 && module === "Template" && (
        <div className="flex flex-col h-[480px] items-center justify-center gap-[20px]">
          <div>
            <SvgComponent name={noDataIcon} />
          </div>
          <div>
            <h2 className="font-semibold text-xl">
              {t("Add")} {t(selectedType)} {t("Template")}
            </h2>
          </div>
          <div>
            <p className="text-[#687779] text-sm">
              {t("Add")} {t(selectedType)} {t("template by clicking on the button.")}
            </p>
          </div>
          <div>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md text-sm"
              onClick={() => setOpenModal(true)}
            >
              <SvgComponent name={"plusIcon"} />
              {t("Add")} {t(selectedType)}
            </button>
          </div>
        </div>
      )}
      {!data?.length > 0 && module !== "Template" && (
        <div className="flex flex-col h-[480px] items-center justify-center gap-[20px]">
          <div>
            <SvgComponent name={icon} />
          </div>
          <div>
            <h2 className="font-semibold text-xl">{t(module)} {t(noDataHeading)}</h2>
          </div>
          <div>
            <p className="text-[#687779] text-sm">
              {t(noDatastatement)} {t(module)}.
            </p>
          </div>
        </div>
      )}
      <ImagePreviewModal
        imageSrc={imageSrc}
        isOpen={imageModal}
        onClose={() => setImageModal(false)}
      />
      <VideoPreviewModal
        videoSrc={imageSrc}
        isOpen={videoModal}
        onClose={() => {
          setImageSrc(null);
          setVideoModal(false);
        }}
      />
    </div>
  );
};

export default CommonTable;
