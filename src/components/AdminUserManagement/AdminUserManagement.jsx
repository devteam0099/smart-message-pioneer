import React, { useEffect, useState } from "react";
// import SvgComponent from "./SvgComponent"; // Adjust the path accordingly
import MainLayout from "../Layout/Layout";
import SvgComponent from "../SvgComponent/SvgComponent";
import CommonTable from "../common/CommonTable";
import Pagination from "../Pagination/Pagination";
// import TemplateUpsert from "./TemplateUpsert";
// import MaterialTagsUpsert from "./MaterialTagsUpsert";
import { toast } from "react-toastify";
import Card from "../AgentDashBoard/StatusDetail/Card";
import { formatDateDayMonthYear } from "../../Utils/helper";

const AdminUserManagement = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showUserUpsert, setShowUserUpsert] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([
    "Name",
    `Email`,
    "Role",
    "Registration Date",
    "Status",
  ]);
  const [noDataIcon, setNoDataIcon] = useState("AgentIcon");
  const [userId, setUserId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleStatusSwitch = async (id, status) => {
    const body = {
      id: id,
      is_active: status,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/update`,
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
        setFilteredData((prevData) =>
          prevData.map((item) =>
            item.ID === id ? { ...item, Status: status } : item
          )
        );
      } else {
        toast.error(data?.data || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error?.message);
      console.error("Error updating profile:", error);
    }
  };
  const fetchUsers = async () => {
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
        setTotalUsers(data?.total);
        // setCurrentPage(1)
        const filtered = data?.data?.map((item) => ({
          Name: item?.Fullname,
          Email: item?.Email,
          "Assigned Accounts": item?.WhatsappAccount,
          "Registration Date": formatDateDayMonthYear(item?.CreatedAt),
          ID: item?.ID,
          Role: item?.Role,
          Status: item?.Active,
        }));
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
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
    fetchUsers();
    setCurrentPage(1);
  }, [searchInput]);
  useEffect(() => {
    fetchUsers();
  }, [currentPage, entriesPerPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);
  return (
    <>
      {/* <MainLayout> */}
      <div className="p-4 template-management-container flex flex-col gap-[20px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Admin &gt;</span>
            <span className="text-gray-800 font-semibold">User Management</span>
          </div>
        </div>
        <Card icon={"totalFriends"} title={"Total Users"} count={totalUsers} />
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="font-bold text-[18px] ">User List</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative template-search-wrapper">
              <input
                value={searchInput}
                type="text"
                placeholder="Search Users"
                className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchInput(e?.target?.value)}
              />
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                // onClick={fetchUsers}
              >
                <SvgComponent name={"GraySearchIcon"} />
              </span>
            </div>
          </div>
        </div>
        <CommonTable
          headers={headers}
          data={filteredData}
          moreOptions={moreOptions}
          setOpenModal={setShowUserUpsert}
          fetchMedia={fetchUsers}
          noDataIcon={noDataIcon}
          setId={setUserId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isActive={isActive}
          setIsActive={setIsActive}
          toggleSwitch={toggleStatusSwitch}
          module={"Admin User Management"}
        />
      </div>

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

export default AdminUserManagement;
