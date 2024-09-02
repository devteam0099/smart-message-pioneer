import React, { useEffect, useRef, useState } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import InputTag from "../common/InputTag";
import { toast } from "react-toastify";
import { colorPairs, colors } from "../common/ColorPairs";
import { useTranslation } from "react-i18next";

const AssignAccount = ({
  setOpenModal,
  selectedIds,
  data,
  agentId,
  setAgentId,
  setFilteredData,
  fetchAccounts,
}) => {
  const { t } = useTranslation();
  const [userAgents, setUserAgents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [assignedAgent, setAssignedAgent] = useState({});
  const fetchSingleAgent = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account?acc_id=${agentId}`,
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
        if (
          data?.data?.UserAgent &&
          Object.keys(data?.data?.UserAgent).length > 0
        ) {
          setAssignedAgent(data?.data?.UserAgent);
        } else {
          fetchUserAgents();
        }
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchSingleAgent();
    }
  }, [agentId]);
  // useEffect(() => {
  //   if (agentId) {
  //     const agentData = data?.filter((el) => el?.ID === agentId);
  //     if (agentData?.[0] && Object.keys(agentData[0]).length > 0) {
  //       setAssignedAgent(agentData[0]?.assignedAgent);
  //     } else {
  //       setAssignedAgent({});
  //       fetchUserAgents();
  //     }
  //   }
  // }, [data, agentId]);
  const onClose = () => {
    setOpenModal(false);
    setAgentId(null);
    setAssignedAgent({});
    setUserAgents([]);
  };
  // Fetch data from the API when the component mounts
  const fetchUserAgents = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent/list?limit=&page_no=1&name=${searchInput}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response?.json();

      if (result?.code === 200 || result?.code === 1000) {
        setUserAgents([]);
        setAssignedAgent({});
        const formattedUsers = result?.data?.map((user) => {
          const initials = user?.Fullname?.split(" ")
            .map((name) => name?.[0])
            .join("");
          const randomIndex = Math.floor(Math.random() * colors.length);
          return {
            ...user,
            initials,
            color: colorPairs[randomIndex]?.bg,
            textColor: colorPairs[randomIndex]?.text,
          };
        });
        setUserAgents(formattedUsers);
        setAssignedAgent({});
      }
    } catch (error) {
      console.error("Error fetching user agents:", error);
      toast.error(error?.message);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (Object.keys(assignedAgent)?.length === 0) {
      fetchUserAgents();
    }
  }, [searchInput]);

  const handleAssignAgent = async (rowId) => {
    if (!selectedAgentId) {
      return;
    }
    let url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/assign`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_agent_id: selectedAgentId,
          account_id: agentId,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (result?.code === 200 || result?.code === 1000) {
        toast.success(t("Account assigned successfully"));
        fetchAccounts();
        onClose();
        return true;
      } else {
        toast.error(result?.data || t("Failed to assign account"));
        return false;
      }
    } catch (error) {
      toast.error(error?.message || t("Failed to assign account"));
      console.error(error);
      return false;
    }
  };
  const handleUnAssign = async (rowId) => {
    let url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/agent/unassign`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: rowId || assignedAgent?.Id,
          acc_id: agentId,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (result?.code === 200 || result?.code === 1000) {
        toast.success(t("Account unassigned successfully"));
        fetchAccounts();
        onClose();
        return true;
      } else {
        toast.error(result?.data || t("Failed to unassign account"));
        return false;
      }
    } catch (error) {
      toast.error(error?.message || t("Failed to unassign account"));
      console.error(error);
      return false;
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] account-assign-upsert-container">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{t("Assign Account")}</h2>

        {/* {! ( */}
        <div className="relative template-search-wrapper">
          <InputTag
            value={searchInput}
            type="text"
            placeholder={t("Search Service Agents")}
            customClass="w-[100%] h-[50px] mb-4 px-4 py-2 !pl-9 rounded-[8px] shadow-md"
            onChange={(e) => setSearchInput(e?.target?.value)}
            disabled={Object.keys(assignedAgent)?.length > 0 ? true : false}
          />
          <span className="absolute left-3 top-[37%] transform -translate-y-1/2 text-gray-400 cursor-pointer search-icon-wrap">
            <SvgComponent name={"GraySearchIcon"} />
          </span>
        </div>
        {/* )} */}

        <div
          className={`p-4 bg-gray-50 rounded-xl max-h-[300px] overflow-y-auto mb-4 ${
            userAgents?.length === 0 && Object.keys(assignedAgent)?.length === 0
              ? "flex items-center justify-center h-[300px] "
              : ""
          } `}
        >
          {assignedAgent && Object.keys(assignedAgent)?.length > 0 ? (
            <div
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 last:mb-0 assigned"
              aria-label={assignedAgent?.Id}
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-blue-100`}
                >
                  <span className={`text-xl font-semibold text-blue-500`}>
                    {assignedAgent?.FullName?.split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">
                    {assignedAgent?.FullName}
                  </h4>
                  <p className="text-gray-500">{assignedAgent?.Email}</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => handleUnAssign(assignedAgent?.Id)}
              >
                <SvgComponent name={"SmDeleteIcon"} />
              </button>
            </div>
          ) : (
            userAgents &&
            userAgents?.length > 0 &&
            Object.keys(assignedAgent)?.length === 0 &&
            userAgents?.map((user, index) => (
              <div
                key={user.ID}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 last:mb-0 testing"
                aria-label={user?.ID}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${user?.color}`}
                  >
                    <span
                      className={`text-xl font-semibold ${user?.textColor}`}
                    >
                      {user?.initials?.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{user?.Fullname}</h4>
                    <p className="text-gray-500">{user?.Email}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="assignAgent"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={selectedAgentId === user?.ID}
                  onChange={() => setSelectedAgentId(user?.ID)}
                />
              </div>
            ))
          )}
          {Object.keys(assignedAgent)?.length === 0 &&
            userAgents?.length === 0 && (
              <div className="flex flex-col justify-center items-center gap-[15px] ">
                <div className="w-fit p-[20px] rounded-[100%] bg-[#D9DCED] ">
                  <SvgComponent name={"addAccountSmallGreyIcon"} />
                </div>
                <div>{t("No Account has been assigned yet.")}</div>
              </div>
            )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 w-[100%]"
          >
            {t("Cancel")}
          </button>
          {/* {! ( */}
          <button
            type="button"
            onClick={() => {
              Object.keys(assignedAgent)?.length > 0
                ? handleUnAssign()
                : handleAssignAgent();
            }}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-[100%] ${
              Object.keys(assignedAgent)?.length === 0 &&
              !selectedAgentId &&
              "opacity-50"
            }`}
            // disabled={Object.keys(assignedAgent)?.length > 0}
          >
            {Object.keys(assignedAgent)?.length > 0
              ? t("Unassign")
              : t("Assign")}
          </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default AssignAccount;
