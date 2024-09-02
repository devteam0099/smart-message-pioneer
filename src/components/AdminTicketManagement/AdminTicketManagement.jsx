import React, { useEffect, useState } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import Pagination from "../Pagination/Pagination";
import { toast } from "react-toastify";
import avatar from "../../Assets/user.png";
import BreadCrumbs from "../common/BreadCrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import { formatLastUpdated } from "../../Utils/helper";
import TicketListing from "../ContactSupport/TicketListing";

const AdminTicketManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showAgentUpsert, setShowAgentUpsert] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([
    "Subject",
    "Description",
    "Case Number",
    "Severity",
    "Last updated",
    "Created",
    "Created by",
    "Status",
  ]);
  const [noDataIcon, setNoDataIcon] = useState("TicketIcon");
  const [agentId, setAgentId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const breadcrumbItems = ["Admin", "Tickets"];

  const formatDateMonthDayYearTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };
  //   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log("Your current time zone is:", timeZone);

  //   console.log("window.location.href", window.location.href)

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/doublefollowers/v1/ticket/list?limit=${entriesPerPage}&page_no=${
          currentPage || 1
        }&case_number=${searchInput}`,
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
        const toatalPage = Math.ceil(data?.total / entriesPerPage);
        setTotalPages(toatalPage || 1);
        setTotalAgents(data?.total);
        const filtered = data?.data?.map((item) => ({
          ID: item?.ID,
          Subject: item?.Subject,
          Status: item?.Status,
          "Case Number": item?.CaseNumber,
          Description: item?.Description,
          Severity: item?.Severity,
          "Last updated": `${formatLastUpdated(
            item?.UpdatedAt,
            window.location.href.includes("doublefollowers-smp.mslm.io")
          )}`,
          Created: formatDateMonthDayYearTime(item?.CreatedAt),
          createdBy: {
            name: item?.CreatedBy?.FullName,
            avatar: avatar,
          },
        }));
        setFilteredData(filtered);
      } else {
        toast.error(data?.data || data?.code);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
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

      if (result?.code === 200) {
        toast.success(`Ticket deleted successfully`);
        setSelectedIds([]);
        fetchTickets();
        return true;
      } else {
        toast.error(result?.message || `Failed to delete agent`);
        return false;
      }
    } catch (error) {
      toast.error(error?.message);
      console.error(error);
      return false;
    }
  };

  // console.log("templateData", templateData);
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
    fetchTickets();
  }, [currentPage, entriesPerPage, searchInput]);
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchInput]);
  return (
    <>
      {/* <MainLayout> */}
      <div className="p-4 template-management-container flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <BreadCrumbs items={breadcrumbItems} />
        </div>
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="font-bold text-[18px] ">Support Tickets</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative template-search-wrapper">
              <input
                value={searchInput}
                type="text"
                placeholder="Search by case number"
                className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchInput(e?.target?.value)}
              />
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                // onClick={fetchTickets}
              >
                <SvgComponent name={"GraySearchIcon"} />
              </span>
            </div>
            {/* <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md"
              onClick={() => {
                navigate("/contact-support/create-ticket");
              }}
            >
              Create Ticket
            </button> */}
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
        <TicketListing
          headers={headers}
          data={filteredData}
          // data={[]}
          moreOptions={moreOptions}
          setOpenModal={setShowAgentUpsert}
          fetchMedia={fetchTickets}
          noDataIcon={noDataIcon}
          setId={setAgentId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleDelete={handleDelete}
          module={"Admin Ticket"}
        />
      </div>
      {/* {filteredData?.length > 0 && ( */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        entriesPerPage={entriesPerPage}
        onEntriesChange={onEntriesChange}
      />
      {/* )} */}
      {/* </MainLayout> */}
    </>
  );
};

export default AdminTicketManagement;
