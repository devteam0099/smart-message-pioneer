import { useEffect, useState } from "react";
import CreateCatagoryModal from "./models/createCatagoryModel";
import SvgComponent from "../SvgComponent/SvgComponent";
import BreadCrumbs from "../common/BreadCrumbs";
import Pagination from "../Pagination/Pagination";
import CommonTable from "../common/CommonTable";
import { toast } from "react-toastify";
import apiRequest from "../../Utils/apiRequest";

const FAQAdminSection = () => {
  const [activeTab, setActiveTab] = useState("catagory");
  const [searchInput, setSearchInput] = useState("");
  const breadcrumbItems = ["Admin", "FAQ"];
  const [options, setOptions] = useState();
  const [noDataIcon, setNoDataIcon] = useState("AgentIcon");
  const [catagoryList, setCatagoryList] = useState([]);
  const [catagoryData, setCatagoryData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [openCreateModel,setOpenCreateModel] = useState(false)
  const [userId, setUserId] = useState(null);
  const [rowData, setRowData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isRender, setIsRender] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [headers, setHeaders] = useState(["Name", "Description"]);
  const moreOptions = [
    { value: "1", label: "Edit" },
    { value: "2", label: "Delete" },
  ];

  const fetchFaqCatagory = async () => {
    const data  = await apiRequest('GET',`/faq-category/list?page_no=${currentPage}&limit=${entriesPerPage}&name=${searchInput}`)
    if (data.total) {
      const numberOfPages = Math.ceil(data.total / entriesPerPage);
      setTotalPages(numberOfPages);
    }
      setCatagoryList(() => {
        const newItems =
          data?.data &&
          data.data.length > 0 &&
          data?.data?.map((item) => ({
            Name: item.Name,
            Description: item.Description,
            ID: item.ID,
          }));
        return newItems ? [...newItems] : [];
      });
  };

  const fetchFaqList = async () => {
    const data = await apiRequest('GET',`/faq/list?page_no=${currentPage}&limit=${entriesPerPage}`)
    if (data.total) {
      const numberOfPages = Math.ceil(data.total / entriesPerPage);
      setTotalPages(numberOfPages);
    }
    
    data.data
      ? setCatagoryData(
          () =>
            data?.data?.length > 0 &&
            data.data.map((item) => ({
              ID: item.ID,
              Question: item.Question,
              Answer: item.Answer,
              "Associated Catagory": item.Category?.Name,
              category_id: item.Category.ID,
            }))
        )
      : setCatagoryData([]);
  };

  const deleteData = async () => {
    const singleDelete = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    };
    const bulkDelete = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ids: selectedIds }),
    };
    try {
      activeTab === "catagory"
        ? selectedIds.length > 1
          ? await apiRequest('DELETE','/faq-category/bulk/delete',{ ids: selectedIds })
          : await apiRequest('DELETE',`/faq-category/delete?id=${selectedIds[0]}`)
        : selectedIds.length > 1
        ? await apiRequest('DELETE','/faq/bulk/delete',{ids : selectedIds})
        : await apiRequest('DELETE',`/faq/delete?id=${selectedIds[0]}`)

      activeTab === "catagory"
        ? selectedIds.length > 1
          ? toast.success("all catagories have been deleted succesfully")
          : toast.success("catagory has been deleted successfully")
        : selectedIds.length > 1
        ? toast.success("all faqs have been deleted successfully")
        : toast.success("faq has been deleted successfully");

      setIsRender(!isRender);
      selectedIds.length = 0;
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    activeTab === "catagory" && fetchFaqCatagory();
  }, [isRender, activeTab, searchInput, currentPage, entriesPerPage]);
  useEffect(() => {
    activeTab === "qa" && fetchFaqList();
  }, [isRender, activeTab, searchInput, currentPage, entriesPerPage]);

  const handleDelete = (data, option, id) => {
    setRowData(data);
    console.log(data)
   // setOpenEditAndDeleteModel(true);
   setOpenCreateModel(true)
    setOptions({ option, id });
  };

  const handleCatagoryClick = () => {
    setActiveTab("catagory");
    setHeaders(["Name", "Description"]);
  };

  const handleQaClick = () => {
    setActiveTab("qa");
    setHeaders(["Question", "Answer", "Associated Catagory"]);
  };

  const handleButtonClick = () => {
    setOptions({ option : "create" });
    setOpenCreateModel(true)
  };
  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const onEntriesChange = (entries) => {
    setEntriesPerPage(entries);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchInput,activeTab]);

  return (
    <>
      <div className="flex items-center justify-between mb-4 ">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="flex justify-between">
        <div
          className={`flex bg-gray-200 p-1 border-radius-10 w-[200px] h-12 mt-4 `}
        >
          <button
            className={`flex-1 text-xs p-2.5 border-radius-8  ${
              activeTab === "catagory"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
            onClick={handleCatagoryClick}
          >
            <div className="flex justify-around ">
              <span className="">
                <SvgComponent name={"faq"} />
              </span>
              <span>Catagory</span>
            </div>
          </button>
          <button
            className={`flex-1 text-xs p-2.5 border-radius-8 ${
              activeTab === "qa" ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            onClick={handleQaClick}
          >
            <div className="flex justify-around">
              <span className="">
                <SvgComponent name={"faq"} />
              </span>
              <span>Q/A</span>
            </div>
          </button>
        </div>
        <div className="relative template-search-wrapper mx-2">
          <input
            value={searchInput}
            type="text"
            placeholder={
              activeTab === "catagory" ? "Search Catagory" : "Search Q/A"
            }
            className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchInput(e?.target?.value)}
          />
          <span
            className={` absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer ${
              selectedIds.length > 0 ? " mt-2" : "-mt-2"
            }`}
          >
            <SvgComponent name={"GraySearchIcon"} />
          </span>
          <button
            onClick={handleButtonClick}
            className="flex-1 text-xs p-2.5 w-36 rounded-full bg-blue-500 text-white ml-4"
          >
            <div className="flex justify-around">
              <span className="">
                <SvgComponent name={"plusIcon"} />
              </span>
              <span className="text-[15px]">
                {activeTab === "catagory" ? "Add Catagory" : "Add Q/A"}
              </span>
            </div>
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={deleteData}
              className="flex-1 text-xs p-2.5 rounded-full text-white ml-4 "
            >
              <div className="">
                <span className="bg-white mt-4">
                  <SvgComponent name={"RedDeleteIcon"} />
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
      <CommonTable
        headers={headers}
        data={activeTab === "catagory" ? catagoryList : catagoryData}
        moreOptions={moreOptions}
        noDataIcon={noDataIcon}
        setId={setUserId}
        setSelectedIds={setSelectedIds}
        isActive={isActive}
        setIsActive={setIsActive}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        tag={"Text Template"}
        icon={"faq"}
        noDataHeading={"No FAQs"}
        noDatastatement={"click on add button to get started"}
      />
      { openCreateModel && (
        <CreateCatagoryModal
          activeTab={activeTab}
          setOpenModal={setOpenCreateModel}
          isRender={isRender}
          setIsRender={setIsRender}
          options={options}
          rowData={rowData}
          currentPage={setCurrentPage}
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
export default FAQAdminSection;
