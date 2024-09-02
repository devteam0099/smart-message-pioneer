import React, { useState, useRef, useEffect, act } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const TicketActions = ({
  setOpenModal,
  isLoading,
  actionType,
  setIsLoading,
  setActionType,
  fetchSingleTicket,
  Status,
}) => {
  const params = useParams();
  const { id } = params;

  const onClose = () => {
    setOpenModal(false);
    setActionType(null);
  };
  const handleUpdateStatus = async () => {
    // if (actionType !== "Resolve") {
    //   return;
    // }
    setIsLoading(true);
    const body = {
      ticket_id: id,
      status: Status ? Status?.value : "Resolved",
    };
    if (actionType === "Escalate") {
      body.severity = "Sev 1";
    }
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
        toast.success(actionType === "Escalate" ? `Case escalated successfully!` : `Status updated successfully!`);
        fetchSingleTicket();
        onClose();
        setIsLoading(false);
      } else {
        toast.error(data?.data || "Something went wrong!");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.message);
      console.error("Error updating status:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative flex flex-col gap-[40px] ">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {actionType === "Resolve" ? "Resolve Case" : "Escalate Case"}
        </h2>
        <>
          {actionType === "Resolve" ? (
            <span>
              <span className="block">
                Do you want resolve the case “Please ignore testing slack”?{" "}
              </span>
              <span className="block">Your actions will be irreversible.</span>
            </span>
          ) : (
            <span className="block">
              Do you want escalate the case “Please ignore testing slack”?
            </span>
          )}
        </>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleUpdateStatus}
            // disabled={actionType === "Escalate"}
            // style={{ opacity: actionType === "Escalate" ? 0.5 : 1 }}
          >
            {isLoading ? (
              <>
                <i className="fa fa-circle-o-notch fa-spin mr-1"></i>
                Processing
              </>
            ) : actionType === "Escalate" ? (
              "Escalate"
            ) : (
              "Resolve"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketActions;
