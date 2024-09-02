import React, { useEffect, useState } from "react";
// import SvgComponent from "./SvgComponent"; // Adjust the path accordingly
import MainLayout from "../Layout/Layout";
import SvgComponent from "../SvgComponent/SvgComponent";
import CommonTable from "../common/CommonTable";
import Pagination from "../Pagination/Pagination";
import TemplateUpsert from "./TemplateUpsert";
import MaterialTagsUpsert from "./MaterialTagsUpsert";
import { toast } from "react-toastify";
import MediaTypes, { TagTypes } from "../../Utils/templateTypeEnum";
import { formatDateDayMonthYear } from "../../Utils/helper";
import { useTranslation } from "react-i18next";
import BreadCrumbs from "../common/BreadCrumbs";

const TemplateManagement = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(MediaTypes.IMAGE);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showTemplateUpsert, setShowTemplateUpsert] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [headers, setHeaders] = useState([
    "Name",
    `${selectedType} Template`,
    "Date Created",
  ]);
  const [noDataIcon, setNoDataIcon] = useState("ImageTemplateIcon");
  const [templateId, setTemplateId] = useState(null);
  const [tagId, setTagId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalTitle, setModalTitle] = useState(`Add ${selectedType}`);
  const [templateTitle, setTemplateTitle] = useState(`${selectedType} Name`);
  const [tagTitle, setTagTitle] = useState("Material Tags");
  const [totalPages, setTotalPages] = useState(1);
  const breadcrumbItems = ["User", "Template Management"];

  const formatType = (type) =>
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const fetchMedia = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/doublefollowers/v1/template/list?limit=${entriesPerPage}&page_no=${currentPage}&name=${searchInput}&type=${selectedType?.toUpperCase()}&category=MATERIAL_TAG`,
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
        setTemplateData(data?.data);
        setHeaders(["Name", `${selectedType} Template`, "Date Created"]);
        const toatalPage = Math.ceil(data?.total / entriesPerPage);
        setTotalPages(toatalPage || 1);
        // setCurrentPage(1)
        const filtered = data?.data
          ?.filter((item) => item.Type === selectedType?.toUpperCase())
          ?.map((item) => ({
            Name: item.Name,
            [`${formatType(item.Type)} Template`]: item.Content,
            "Date Created": formatDateDayMonthYear(item.CreatedAt),
            ID: item?.ID,
          }));
        setFilteredData(filtered);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  // console.log("templateId", templateId, "tagId", tagId);
  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/list?limit=${
          showTemplateUpsert ? "" : entriesPerPage
        }&page_no=${currentPage}&name=${searchInput}&tag_type=MATERIAL_TAG`,
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
        // console.log("data?.data", data?.data);
        const toatalPage = Math.ceil(data?.total / entriesPerPage);
        setTotalPages(toatalPage || 1);
        setTagData(data?.data);
        const tagOption = data?.data?.map((item) => ({
          label: item?.Name,
          value: item?.ID,
        }));
        setTagOptions(tagOption);
        // console.log("tagData in ", tagData);
        selectedType === "Material Tags" &&
          setHeaders([
            "Tag Name",
            "No. text material",
            "No. picture material",
            "No. video material",
            "No. voice material",
            "Date Created",
          ]);
        const filtered = data?.data?.map((item) => ({
          "Tag Name": item?.Name,
          "No. text material": item?.TextCount,
          "No. picture material": item?.ImageCount,
          "No. video material": item?.VideoCount,
          "No. voice material": item?.VoiceCount,
          "Date Created": formatDateDayMonthYear(item.CreatedAt),
          ID: item?.ID,
        }));
        selectedType === "Material Tags" && setFilteredData(filtered);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    showTemplateUpsert && fetchTags();
  }, [showTemplateUpsert]);
  useEffect(() => {
    fetchMedia();
    fetchTags();
  }, []);
  useEffect(() => {
    if (tagId || templateId) {
      setShowTemplateUpsert(true);
    }
  }, [tagId, templateId]);
  const handleDelete = async (rowId) => {
    let url;
    if (selectedType === "Material Tags") {
      url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/delete`;
    } else {
      url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/template/bulk/delete`;
    }
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

      if (result?.code === 1000 || result?.code === 200) {
        toast.success(
          `${
            selectedType === "Material Tags" ? "Tag" : "Template"
          } deleted successfully`
        );
        setSelectedIds([]);
        selectedType === "Material Tags" ? fetchTags() : fetchMedia();
        return true;
      } else {
        toast.error(
          result?.message ||
            `Failed to delete ${
              selectedType === "Material Tags" ? "tag" : "template"
            }`
        );
        return false;
      }
    } catch (error) {
      toast.error(error?.message);
      console.error(error);
      return false;
    }
  };
  useEffect(() => {
    if (selectedType === "Material Tags") {
      fetchTags();
      setNoDataIcon(`TagTemplateIcon`);
    } else {
      fetchMedia();
      setNoDataIcon(`${selectedType}TemplateIcon`);
    }
    setTemplateTitle(`${selectedType} Name`);
    setModalTitle(`Add ${selectedType}`);
  }, [currentPage, entriesPerPage]);
  useEffect(() => {
    setFilteredData([]);
    if (selectedType === "Material Tags") {
      fetchTags();
      setNoDataIcon(`TagTemplateIcon`);
    } else {
      fetchMedia();
      setNoDataIcon(`${selectedType}TemplateIcon`);
    }
    setTemplateTitle(`${selectedType} Name`);
    setModalTitle(`Add ${selectedType}`);
    setCurrentPage(1);
  }, [selectedType]);
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
    if (selectedType === "Material Tags") {
      fetchTags();
    } else {
      fetchMedia();
    }
    setCurrentPage(1);
  }, [searchInput]);
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);
  // useEffect(() => {
  //   console.log({filteredData})
  // }, [filteredData])
  return (
    // <>
    <>
      <div className="p-4 template-management-container flex flex-col gap-[25px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <BreadCrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <div className="flex bg-gray-200 p-1 border-radius-10">
            <button
              className={`flex items-center justify-center text-xs px-6 py-2 border-radius-8 ${
                selectedType === MediaTypes.IMAGE
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes.IMAGE)}
            >
              <SvgComponent name={"gallery"} />{" "}
              <span className="ml-2">{t("Image")}</span>
            </button>
            <button
              className={`flex items-center justify-center text-xs px-6 py-2 border-radius-8 ${
                selectedType === MediaTypes?.VIDEO
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.VIDEO)}
            >
              <SvgComponent name={"videoCamera"} />{" "}
              <span className="ml-2">{t("Video")}</span>
            </button>
            <button
              className={`flex items-center justify-center text-xs px-6 py-2 border-radius-8 ${
                selectedType === MediaTypes?.VOICE
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.VOICE)}
            >
              <SvgComponent name={"voiceCircles"} />{" "}
              <span className="ml-2">{t("Voice")}</span>
            </button>
            <button
              className={`flex items-center justify-center text-xs px-6 py-2 border-radius-8 ${
                selectedType === MediaTypes?.TEXT
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.TEXT)}
            >
              <SvgComponent name={"text"} />{" "}
              <span className="ml-2">{t("Text")}</span>
            </button>
            <button
              className={`flex items-center justify-center text-xs px-6 py-2 border-radius-8 ${
                selectedType === "Material Tags"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType("Material Tags")}
            >
              <SvgComponent name={"MaterialTag"} />{" "}
              <span className="ml-2">{t("Material Tags")}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative template-search-wrapper">
              <input
                value={searchInput}
                type="text"
                placeholder={`${t("Search")} ${t(selectedType)} ${
                  selectedType !== "Material Tags" ? t("Templates") : ""
                }`}
                className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchInput(e?.target?.value)}
              />
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                // onClick={fetchMedia}
              >
                <SvgComponent name={"GraySearchIcon"} />
              </span>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md"
              onClick={() => {
                setShowTemplateUpsert(!showTemplateUpsert);
              }}
            >
              <SvgComponent name={"plusIcon"} />
              {t("Add")} {t(selectedType)}
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
          selectedType={selectedType}
          setOpenModal={setShowTemplateUpsert}
          fetchMedia={fetchMedia}
          fetchTags={fetchTags}
          noDataIcon={noDataIcon}
          setId={selectedType === "Material Tags" ? setTagId : setTemplateId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleDelete={handleDelete}
          module={"Template"}
        />
      </div>
      {showTemplateUpsert && selectedType !== "Material Tags" && (
        <TemplateUpsert
          setOpenModal={setShowTemplateUpsert}
          selectedType={selectedType}
          tagOptions={tagOptions}
          fetchMedia={fetchMedia}
          templateId={templateId}
          setTemplateId={setTemplateId}
          tagTitle={tagTitle}
          templateTitle={templateTitle}
          modalTitle={modalTitle}
          tagType={TagTypes?.MATERIAL_TAG}
        />
      )}
      {showTemplateUpsert && selectedType === "Material Tags" && (
        <MaterialTagsUpsert
          setOpenModal={setShowTemplateUpsert}
          selectedType={selectedType}
          fetchTags={fetchTags}
          tagId={tagId}
          setTagId={setTagId}
          tagType={TagTypes?.MATERIAL_TAG}
          tagTitle={"Tag"}
        />
      )}
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
    </>

    // </>
  );
};

export default TemplateManagement;
