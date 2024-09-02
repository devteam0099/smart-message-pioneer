import React, { useEffect, useState } from "react";
import BreadCrumbs from "../common/BreadCrumbs";
import Chat from "../AgentDashBoard/Chat/Chat";
import SvgComponent from "../SvgComponent/SvgComponent";
import TicketActions from "./TicketActions";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  formatDateMonthDayYearTime,
  formatLastUpdated,
} from "../../Utils/helper";
import VideoPreviewModal from "../common/VideoPreviewModal";
import ImagePreviewModal from "../common/ImagePreviewModal";

const TicketDetail = () => {
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const options = [
    { value: "Action Required", label: "Action Required" },
    { value: "Customer responded", label: "Customer responded" },
    { value: "Await Customer", label: "Await Customer" },
    { value: "Pending Support", label: "Pending Support" },
    { value: "Solution Provided", label: "Solution Provided" },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const [formData, setFormData] = useState({
    Subject: "",
    Status: "",
    Severity: "",
    CaseNumber: "",
    Category: "",
    Difference: "",
    UpdatedAt: "",
    attachment: "",
  });

  const breadcrumbItems = [
    { label: "User" },
    {
      label: "Contact Support",
      route: location.pathname.includes("admin")
        ? "/admin/ticket-management"
        : "/contact-support",
    },
    { label: "Ticket" },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = async (option) => {
    setFormData((prev) => ({ ...prev, Status: option }));
    await handleUpdateStatus(option);
    setIsOpen(false);
  };

  const getStatusClass = (value) => {
    switch (value) {
      case "Action Required":
        return "!bg-red-100  border-red-300 text-red-600";
      case "Customer responded":
        return "!bg-yellow-100  border-yellow-300 text-yellow-600";
      case "Await Customer":
        return "!bg-gray-100  border-gray-300 text-gray-600";
      case "Pending Support":
        return "!bg-blue-100  border-blue-300 text-blue-500";
      case "Solution Provided":
        return "!bg-green-100  border-green-300 text-green-500";
      case "Resolved":
        return "!bg-green-100  border-green-300 text-green-500";
      default:
        return "!bg-gray-100  border-gray-300 text-gray-800";
    }
  };
  const fetchSingleTicket = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/ticket/detail?ticket_id=${id}`,
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
      if (data?.code === 200 || data?.code === 1000) {
        setFormData((prev) => ({
          ...prev,
          Subject: data?.data?.Subject,
          Status: {
            label: data?.data?.Status,
            value: data?.data?.Status,
          },
          Severity: data?.data?.Severity,
          CaseNumber: data?.data?.CaseNumber,
          Category: data?.data?.Category,
          Difference: `${formatLastUpdated(
            data?.data?.UpdatedAt,
            window.location.href.includes("doublefollowers-smp.mslm.io")
          )}`,
          UpdatedAt: `${formatDateMonthDayYearTime(data?.data?.UpdatedAt)}`,
          attachment: data?.data?.FileURL,
        }));
        setSelectedOption(formData?.Status);
      } else {
        toast.error(data?.data || "Error fetching ticket!");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  const handleUpdateStatus = async (option) => {
    setIsLoading(true);
    const body = {
      ticket_id: id,
      status: option?.value,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/ticket/status/update`,
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
        toast.success(`Status updated successfully!`);
        setIsLoading(false);
      } else {
        toast.error(data?.data || "Failed to update status!");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.message);
      console.error("Error updating status:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchSingleTicket();
    }
  }, [id]);
  return (
    Object.values(formData)?.some((value) => value !== "") && (
      <>
        <div className="flex items-center justify-between mb-4">
          <BreadCrumbs items={breadcrumbItems} />
        </div>
        <div className="bg-white rounded-lg shadow-md flex justify-between items-center p-4 mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-500 rounded-full p-2 mr-3">
              <SvgComponent name={"ticketMessageIcon"} />
            </div>
            <div className="text-gray-800 font-medium">{formData?.Subject}</div>
          </div>
          <div className="flex items-center space-x-4">
            {formData?.Severity !== "Sev 1" && (
              <button
                className="bg-blue-50 text-blue-500 px-4 py-2 rounded-full text-sm"
                onClick={() => {
                  setActionType("Escalate");
                  setOpenModal(true);
                }}
              >
                Escalate case
              </button>
            )}
            {formData?.Status?.value !== "Resolved" && (
              <button
                className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm"
                onClick={() => {
                  setActionType("Resolve");
                  setOpenModal(true);
                }}
              >
                Resolve case
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-[24px] ">
          <Chat />
          <div className="flex flex-col gap-[20px]">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Case Details
              </h2>
              <p className="text-gray-500 mb-4">
                {/* Oct 11 2023, 3:10 PM (2 days ago) */}
                {formData?.UpdatedAt} ({formData?.Difference})
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-500">Case number</p>
                  <div className="flex items-center text-gray-800 font-medium gap-[10px] ">
                    <span>{formData?.CaseNumber}</span>
                    <SvgComponent name={"TicketNoIcon"} />
                  </div>
                </div>
                {/* <div>
                <p className="text-gray-500">Status</p>
                <span className="inline-block bg-red-100 text-red-600 py-1 px-2 rounded-full text-sm font-medium">
                  {formData?.Status}
                </span>
              </div> */}
                <div className="relative custom-dropdown grow !p-0 !w-[185px] !text-[14px]">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div
                    className={`flex justify-between border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer !pr-[15px] ${
                      formData?.Status
                        ? getStatusClass(formData?.Status?.value)
                        : ""
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {formData?.Status && formData?.Status?.label}
                    <span
                      className={`dropdown-arrow ${
                        isOpen ? "open" : ""
                      } !p-[3px] `}
                    ></span>
                  </div>
                  {isOpen && (
                    <ul className="dropdown-list !absolute mt-1 bg-white border border-gray-300 rounded-md z-10">
                      {options.map((option) => (
                        <li
                          key={option.value}
                          className={`dropdown-item p-2 hover:bg-[#f3f5fb] cursor-pointer ${getStatusClass(
                            option.value
                          )}`}
                          onClick={() => handleOptionClick(option)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div
                className={`grid grid-cols-2 gap-4 ${
                  isOpen ? "!mb-[24px]" : ""
                }`}
              >
                <div>
                  <p className="text-gray-500">Severity</p>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                    <span className="text-gray-800 font-medium">
                      Severity 1
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="text-gray-800 font-medium">
                    {formData?.Category}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
            <div className="flex flex-col gap-[30px] ">
              <h2 className="text-xl font-semibold text-gray-800 ">Watchers</h2>
              <div className="flex items-center justify-between bg-white rounded-lg last:mb-0">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-blue-100`}
                  >
                    <span className={`text-xl font-semibold text-blue-500`}>
                      SD
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Summer Duncan</h4>
                    <p className="text-gray-500">summer@gmail.com</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  // onClick={() => handleUnAssign(assignedAgent?.Id)}
                >
                  <SvgComponent name={"SmDeleteIcon"} />
                </button>
              </div>
              <div className="text-center py-[8px] px-[24px] border-2 border-[#696CFF] rounded-[30px]  ">
                Add Watchers
              </div>
            </div>
          </div> */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
              <div className="flex flex-col gap-[30px] ">
                <h2 className="text-xl font-semibold text-gray-800 ">
                  Attachments
                </h2>
                <div
                  className={`flex items-center justify-center border-2 rounded-lg h-28 cursor-pointer w-[125px] relative ${
                    formData?.attachment ? "" : "border-dashed border-[#696CFF]"
                  } `}
                >
                  {!formData?.attachment && (
                    <span className="text-[#696CFF] text-[32px] ">+</span>
                  )}
                  {formData?.attachment ? (
                    <>
                      {formData?.attachment?.includes("IMAGE/") ? (
                        <img
                          src={formData?.attachment}
                          alt="Attachment Preview"
                          className="object-cover w-full h-full rounded-lg"
                          onClick={(e) => {
                            setImageSrc(formData?.attachment);
                            setImageModal(true);
                          }}
                        />
                      ) : (
                        <>
                          <video
                            src={formData?.attachment}
                            className="object-cover w-full h-full rounded-lg"
                            // controls
                          />
                          <span
                            className="absolute LargePlayVideoIcon"
                            onClick={(e) => {
                              setImageSrc(formData?.attachment);
                              setVideoModal(true);
                            }}
                          >
                            <SvgComponent name={"LargePlayVideoIcon"} />
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-[#696CFF] absolute text-[32px]">
                      +
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {openModal && (
          <TicketActions
            actionType={actionType}
            setActionType={setActionType}
            setOpenModal={setOpenModal}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchSingleTicket={fetchSingleTicket}
            Status={formData?.Status}
          />
        )}
        <VideoPreviewModal
          videoSrc={imageSrc}
          isOpen={videoModal}
          onClose={() => {
            setImageSrc(null);
            setVideoModal(false);
          }}
        />
        <ImagePreviewModal
          imageSrc={imageSrc}
          isOpen={imageModal}
          onClose={() => setImageModal(false)}
        />
      </>
    )
  );
};

export default TicketDetail;
