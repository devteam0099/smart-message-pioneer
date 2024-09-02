import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import MainLayout from "../Layout/Layout";
import SvgComponent from "../SvgComponent/SvgComponent";
import CommonTable from "../common/CommonTable";
import Pagination from "../Pagination/Pagination";
import { toast } from "react-toastify";
import Card from "../AgentDashBoard/StatusDetail/Card";
import AccountManagementUpsert from "./AccountManagementUpsert";
import AssignAccount from "./AssignAccount";
import InputTag from "../common/InputTag";
import { formatDateDayMonthYear } from "../../Utils/helper";
import BreadCrumbs from "../common/BreadCrumbs";

const AccountManagement = () => {
  const { t } = useTranslation();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showAgentUpsert, setShowAgentUpsert] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([
    "Phone Number",
    "Agent Name",
    "Country",
    "Type",
    "Status",
    "Registration Date",
  ]);
  const [noDataIcon, setNoDataIcon] = useState("AccountIcon");
  const [agentId, setAgentId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statsData, setStatsData] = useState([
    { icon: "newFriends", title: "Online Accounts", count: 0 },
    { icon: "totalAccounts", title: "Total Accounts", count: 0 },
    { icon: "totalBanned", title: "Total Banned", count: 0 },
    { icon: "newBanned", title: "Banned Today", count: 0 },
  ]);
  const [assignModal, setAssignModal] = useState(false);
  const breadcrumbItems = ["User", "Account Management"];
  const getAccountStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/stats`,
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
      if (data?.code === 1000 || data?.code === 200) {
        const updatedStats = statsData?.map((stat) => {
          if (stat.icon === "totalFriends") {
            return { ...stat, count: data?.data?.total_friends };
          } else if (stat.icon === "totalAccounts") {
            return { ...stat, count: data?.data?.total_accounts };
          } else if (stat.icon === "newFriends") {
            return { ...stat, count: data?.data?.online_accounts };
          }
          return stat;
        });
        setStatsData(updatedStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getAccountStats();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/list?limit=${entriesPerPage}&page_no=${currentPage}&number=${searchInput}`,
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
        const totalPage = Math.ceil(data?.total / entriesPerPage);
        setTotalPages(totalPage || 1);
        setTotalAgents(data?.total);
        const filtered = data?.data?.map((item) => ({
          "Phone Number": item?.PhoneNumber,
          "Agent Name": item?.UserAgent?.FullName,
          Status: item?.OnlineStatus ? "Online" : "Offline",
          Email: item?.Email,
          Country: item?.LoginLocation,
          Type: item?.IsBusiness ? "Business" : "Personal",
          "Assigned Accounts": item?.WhatsappAccount,
          "Registration Date": formatDateDayMonthYear(item?.RegistrationDate),
          ID: item?.Id,
          assignedAgent: item?.UserAgent,
        }));
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };

  const handleDelete = async (rowId) => {
    let url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/bulk/delete`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: rowId ? rowId : selectedIds }),
        credentials: "include",
      });

      const result = await response.json();

      if (result?.code === 200 || result?.code === 1000) {
        toast.success(t("Agent deleted successfully!"));
        setSelectedIds([]);
        fetchAccounts();
        getAccountStats();
        return true;
      } else {
        toast.error(result?.message || t("Failed to delete agent!"));
        return false;
      }
    } catch (error) {
      toast.error(error?.message);
      console.error(error);
      return false;
    }
  };

  const moreOptions = [
    { value: "1", label: "Assign" },
    { value: "2", label: "Delete" },
  ];

  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onEntriesChange = (entries) => {
    setEntriesPerPage(entries);
  };

  useEffect(() => {
    fetchAccounts();
    setCurrentPage(1);
    getAccountStats();
  }, [searchInput]);

  useEffect(() => {
    fetchAccounts();
    getAccountStats();
  }, [currentPage, entriesPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  return (
    <>
      <div className="p-4 template-management-container flex flex-col gap-[20px] account-management-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <BreadCrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {statsData?.map((item, index) => (
            <Card
              key={index}
              icon={item?.icon}
              title={item?.title}
              count={item?.count}
              customClass="!w-[100%]"
            />
          ))}
        </div>
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="font-bold text-[18px]">{t("Account List")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative template-search-wrapper">
              <InputTag
                value={searchInput}
                type="text"
                placeholder={t("Search Accounts")}
                customClass="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md "
                onChange={(e) => setSearchInput(e?.target?.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                <SvgComponent name={"GraySearchIcon"} />
              </span>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md"
              onClick={() => {
                setShowAgentUpsert(!showAgentUpsert);
              }}
            >
              {t("Create Account")}
            </button>
            {selectedIds?.length > 0 && (
              <button
                className=""
                onClick={() => {
                  handleDelete();
                }}
              >
                <SvgComponent name={"RedDeleteIcon"} />
              </button>
            )}
          </div>
        </div>
        <CommonTable
          headers={headers}
          data={filteredData}
          moreOptions={moreOptions}
          setOpenModal={setShowAgentUpsert}
          fetchMedia={fetchAccounts}
          noDataIcon={noDataIcon}
          setId={setAgentId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleDelete={handleDelete}
          module={"Account"}
          setAssignModal={setAssignModal}
        />
      </div>

      {showAgentUpsert && (
        <AccountManagementUpsert
          setOpenModal={setShowAgentUpsert}
          fetchAccounts={fetchAccounts}
          agentId={agentId}
          setAgentId={setAgentId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          getAccountStats={getAccountStats}
        />
      )}
      {assignModal && (
        <AssignAccount
          setOpenModal={setAssignModal}
          selectedIds={selectedIds}
          data={filteredData}
          agentId={agentId}
          setAgentId={setAgentId}
          setFilteredData={setFilteredData}
          fetchAccounts={fetchAccounts}
        />
      )}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        entriesPerPage={entriesPerPage}
        onEntriesChange={onEntriesChange}
      />
    </>
  );
};

export default AccountManagement;
