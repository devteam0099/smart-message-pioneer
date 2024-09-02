import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SvgComponent from "../SvgComponent/SvgComponent";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../../Utils/helper";

const TicketListing = ({
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
}) => {
  const [showMoreModal, setShowMoreModal] = useState(
    Array(data?.length)?.fill(false)
  );
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      const allIds = data?.map((row) => row.ID);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

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
  }, [data]);

  const handleMoreModal = (index) => {
    setShowMoreModal((prev) => {
      const newState = new Array(prev?.length).fill(false);
      newState[index] = !prev[index];
      return newState;
    });
  };

  return (
    <div className="overflow-auto mb-[50px] table-list-container text-center">
      <table className="w-full rounded-[23px]">
        <thead className="sticky bg-[#F6F6FA] top-0 z-[2] rounded-[23px]">
          <tr className="text-left text-gray-500 text-[14px] text-center border-b border-gray-300">
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
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 &&
            data?.map((row, rowIndex) => (
              <tr
                key={row?.ID}
                className="bg-white cursor-pointer border-b border-gray-300"
                onClick={() => {
                  if (module !== "Admin Ticket") {
                    navigate(`/contact-support/ticket-detail/${row?.ID}`);
                  } else {
                    navigate(
                      `/admin/ticket-management/ticket-detail/${row?.ID}`
                    );
                  }
                }}
              >
                {module !== "Admin Ticket" && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelect(e, row?.ID)}
                      checked={selectedIds?.includes(row?.ID)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {headers?.map((header, colIndex) => {
                  let cellContent;

                  if (header === "Subject") {
                    cellContent = row[header] || "N/A";
                  } else if (header === "Status") {
                    let statusClass = "";

                    switch (row[header]) {
                      case "Action Required":
                        statusClass = "bg-red-100 text-red-500";
                        break;
                      case "Customer responded":
                        statusClass = "bg-yellow-100 text-yellow-600";
                        break;
                      case "Await Customer":
                        statusClass = "bg-gray-100 text-gray-600";
                        break;
                      case "Pending Support":
                        statusClass = "bg-blue-100 text-blue-500";
                        break;
                      case "Solution Provided":
                        statusClass = "bg-green-100 text-green-500";
                      case "Resolved":
                        statusClass = "bg-green-100 text-green-500";
                        break;
                      default:
                        statusClass = "bg-gray-100 text-gray-800";
                    }

                    cellContent = (
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                      >
                        {row[header] || "N/A"}
                      </span>
                    );
                  }

                  // else if (header === "Status") {
                  //   cellContent = (
                  //     <span
                  //       className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  //         row[header] === "Customer responded"
                  //           ? "bg-yellow-100 text-yellow-800"
                  //           : "bg-gray-100 text-gray-800"
                  //       }`}
                  //     >
                  //       {row[header] || "N/A"}
                  //     </span>
                  //   );
                  // }
                  else if (header === "Severity") {
                    let severityColor = "";

                    switch (row[header]) {
                      case "Sev 1":
                        severityColor = "bg-red-500";
                        break;
                      case "Sev 2":
                        severityColor = "bg-orange-500";
                        break;
                      case "Sev 3":
                        severityColor = "bg-blue-500";
                        break;
                      case "Sev 4":
                        severityColor = "bg-gray-400";
                        break;
                      case "Sev 5":
                        severityColor = "bg-gray-300";
                        break;
                      default:
                        severityColor = "bg-gray-300";
                    }

                    cellContent = (
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-block w-2 h-2 ${severityColor} rounded-full mr-2`}
                        ></span>
                        {row[header] || "N/A"}
                      </div>
                    );
                  }

                  // else if (header === "Severity") {
                  //   cellContent = (
                  //     <div className="flex items-center justify-center">
                  //       <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  //       {row[header] || "N/A"}
                  //     </div>
                  //   );
                  // }
                  else if (header === "Created by") {
                    cellContent = (
                      <div className="flex items-center justify-start bg-[#F5EBFF] px-[6px] py-[4px] rounded-full">
                        <img
                          src={row?.createdBy?.avatar || ""}
                          alt={row?.createdBy?.name || "N/A"}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-[#6A6A9A] font-medium">
                          {row?.createdBy?.name || "N/A"}
                        </span>
                      </div>
                    );
                  } else if (header === "Description") {
                    const fullText = row[header] || "N/A";
                    const textClass =
                      fullText?.length >= 50
                        ? `my-anchor-element${rowIndex}`
                        : "";
                    cellContent = (
                      <>
                        <div className={textClass}>
                          {truncateText(fullText, 30)}
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
                  } else {
                    cellContent = row[header] || "N/A";
                  }

                  return (
                    <td key={colIndex} className="p-4">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          <tr className="h-[65px]"></tr>
        </tbody>
      </table>
      {!data?.length > 0 && !module.includes("Admin") && (
        <div className="flex flex-col h-[480px] items-center justify-center gap-[20px]">
          <div>
            <SvgComponent name={noDataIcon} />
          </div>
          <div>
            <h2 className="font-semibold text-xl">Tickets</h2>
          </div>
          <div>
            <p className="text-[#687779] text-sm max-w-[360px] text-wrap text-center ">
              Having issues? Create a ticket and our support team will look into
              it.
            </p>
          </div>
        </div>
      )}
      {!data?.length > 0 && module.includes("Admin") && (
        <div className="flex flex-col h-[480px] items-center justify-center gap-[20px]">
          <div>
            <SvgComponent name={noDataIcon} />
          </div>
          <div>
            <h2 className="font-semibold text-xl">Tickets</h2>
          </div>
          <div>
            <p className="text-[#687779] text-sm max-w-[360px] text-wrap text-center ">
              No Data
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketListing;
