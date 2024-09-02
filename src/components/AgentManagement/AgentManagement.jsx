import React, { useEffect, useState } from "react";
import MainLayout from "../Layout/Layout";
import SvgComponent from "../SvgComponent/SvgComponent";
import CommonTable from "../common/CommonTable";
import Pagination from "../Pagination/Pagination";
import { toast } from "react-toastify";
import MediaTypes, { TagTypes } from "../../Utils/templateTypeEnum";
import Card from "../AgentDashBoard/StatusDetail/Card";
import AgentUpsert from "./AgentUpsert";
import { formatDateDayMonthYear } from "../../Utils/helper";
import BreadCrumbs from "../common/BreadCrumbs";
import { useTranslation } from "react-i18next";

const AgentManagement = () => {
  const { t } = useTranslation();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showAgentUpsert, setShowAgentUpsert] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([
    "Name",
    "Email",
    "Registration Date",
  ]);
  const [noDataIcon, setNoDataIcon] = useState("AgentIcon");
  const [agentId, setAgentId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const breadcrumbItems = ["User", "Agent Management"];

  const fetchAgents = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/doublefollowers/v1/user/agent/list?limit=${entriesPerPage}&page_no=${
          currentPage || 1
        }&name=${searchInput}`,
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
        const toatalPage = Math.ceil(data?.total / entriesPerPage);
        setTotalPages(toatalPage || 1);
        setTotalAgents(data?.total);
        const filtered = data?.data?.map((item) => ({
          Name: item?.Fullname,
          Email: item?.Email,
          "Assigned Accounts": item?.WhatsappAccount,
          "Registration Date": formatDateDayMonthYear(item?.CreatedAt),
          ID: item?.ID,
        }));
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error(t("Error fetching media"), error);
      toast.error(error?.message);
    }
  };

  const handleDelete = async (rowId) => {
    let url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/agent/bulk/delete`;
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
        toast.success(t("Agent deleted successfully"));
        setSelectedIds([]);
        fetchAgents();
        return true;
      } else {
        toast.error(result?.data || t("Failed to delete agent"));
        return false;
      }
    } catch (error) {
      toast.error(error?.message);
      console.error(error);
      return false;
    }
  };

  const moreOptions = [
    { value: "1", label: "Edit" },
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
    fetchAgents();
    setCurrentPage(1);
  }, [searchInput]);
  useEffect(() => {
    fetchAgents();
  }, [currentPage, entriesPerPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);
  return (
    <>
      <div className="p-4 template-management-container flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <BreadCrumbs items={breadcrumbItems} />
          </div>
        </div>
        <Card
          icon={"totalFriends"}
          title={"Total Agents"}
          count={totalAgents}
        />
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="font-bold text-[18px] ">{t("Agent List")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative template-search-wrapper">
              <input
                value={searchInput}
                type="text"
                placeholder={t("Search Agents")}
                className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {t("Create Agent")}
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
          fetchMedia={fetchAgents}
          noDataIcon={noDataIcon}
          setId={setAgentId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleDelete={handleDelete}
          module={"Agent"}
        />
      </div>

      {showAgentUpsert && (
        <AgentUpsert
          setOpenModal={setShowAgentUpsert}
          fetchTags={fetchAgents}
          agentId={agentId}
          setAgentId={setAgentId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
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

export default AgentManagement;
