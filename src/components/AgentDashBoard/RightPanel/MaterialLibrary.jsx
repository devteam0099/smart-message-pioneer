import React, { useEffect, useState } from "react";
import SvgComponent from "../../SvgComponent/SvgComponent";
import UserGroupDetail from "./UserGroupDetail";
import style from "./RightPanel.module.css";
import TemplateUpsert from "../../TemplateManagement/TemplateUpsert";
import MaterialTagsUpsert from "../../TemplateManagement/MaterialTagsUpsert";
import MediaTypes, { TagTypes } from "../../../Utils/templateTypeEnum";
import { toast } from "react-toastify";
import ImagePreviewModal from "../../common/ImagePreviewModal";
import { useTranslation } from "react-i18next";

const MaterialLibrary = (props) => {
  const { t } = useTranslation();
  const [activeMainTab, setActiveMainTab] = useState("Quick Reply");
  const [activeTab, setActiveTab] = useState(TagTypes?.MATERIAL_TAG);
  const [mediaGroups, setMediaGroups] = useState({
    IMAGE: {},
    VIDEO: {},
    VOICE: {},
    TEXT: {},
  });
  const [activeGroups, setActiveGroups] = useState([]);
  const [hoveredIndexes, setHoveredIndexes] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const [selectedType, setSelectedType] = useState(MediaTypes?.IMAGE);
  const [showTemplateUpsert, setShowTemplateUpsert] = useState(false);
  const [showMaterialTagUpsert, setShowMaterialTagUpsert] = useState(false);
  const [selectedMaterialOption, setSelectedMaterialOption] = useState(null);
  const [isMaterialOptionsOpen, setIsMaterialOptionsOpen] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [isSearchOptionsOpen, setIsSearchOptionsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const searchOptions = [
    {
      label: "Materials",
      value: "Materials",
    },
    {
      label: "Tags",
      value: "Tags",
    },
  ];
  const [selectedSearchOption, setSelectedSearchOption] = useState(
    searchOptions[0]
  );

  const handleSearchOptionClick = (option) => {
    setSelectedSearchOption(option);
    setIsSearchOptionsOpen(false);
  };

  const materialOptions = [
    {
      label: "Image",
      value: "Image",
    },
    {
      label: "Video",
      value: "Video",
    },
    {
      label: "Voice",
      value: "Voice",
    },
    {
      label: "Text",
      value: "Text",
    },
  ];

  const handleMaterialOptionClick = (option) => {
    setSelectedMaterialOption(option);
    setIsMaterialOptionsOpen(false);
  };

  const toggleGroupVisibility = (groupName) => {
    setActiveGroups((prevActiveGroups) => {
      if (prevActiveGroups.includes(groupName)) {
        return prevActiveGroups.filter((name) => name !== groupName);
      } else {
        return [...prevActiveGroups, groupName];
      }
    });
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/doublefollowers/v1/template/list?limit=&page_no=1&${
          selectedSearchOption?.value === "Tags"
            ? `tag_name=${searchInput}`
            : `name=${searchInput}`
        }&&type=${selectedType?.toUpperCase()}&category=${activeTab}`,
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
        const groupedData = {
          IMAGE: {},
          VIDEO: {},
          VOICE: {},
          TEXT: {},
        };

        data?.data?.forEach((item) => {
          const type = item.Type;
          const tagName = item.Tags[0]?.Name || t("Ungrouped"); // Group by tag name, default to "Ungrouped"
          if (!groupedData[type][tagName]) {
            groupedData[type][tagName] = [];
          }
          groupedData[type][tagName].push(item);
        });
        // console.log("groupedData", groupedData);
        setMediaGroups(groupedData);
      }
    } catch (error) {
      console.error(t("Error fetching media"), error);
      toast.error(error?.message);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/list?limit=&page_no=&name=&tag_type=${TagTypes?.CUSTOM_TEXT_TO_SPEECH}`,
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
        // setTagData(data?.data);
        const tagOption = data?.data?.map((item) => ({
          label: item?.Name,
          value: item?.ID,
        }));
        setTagOptions(tagOption);
      }
    } catch (error) {
      console.error(t("Error fetching media"), error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchTags();
  }, [selectedType, activeTab]);

  useEffect(() => {
    fetchMedia();
  }, [searchInput]);

  useEffect(() => {
    searchInput && fetchMedia();
  }, [selectedSearchOption]);

  const handleMouseEnter = (groupName, imageIndex) => {
    setHoveredIndexes((prev) => ({ ...prev, [groupName]: imageIndex }));
  };

  const handleMouseLeave = (groupName) => {
    setHoveredIndexes((prev) => ({ ...prev, [groupName]: null }));
  };

  const handleImageClick = (src) => {
    setImageSrc(src);
    setImageModal(true);
  };

  const handleCloseModal = () => {
    setImageSrc(null);
    setImageModal(false);
  };

  const renderGroups = () => {
    const groups = mediaGroups[selectedType?.toUpperCase()];

    return Object.keys(groups).length === 0 ? (
      <p>{t("No media available")}</p>
    ) : (
      Object.keys(groups).map((groupName, groupIndex) => (
        <div key={groupIndex} className={`mb-4 ${style.materialGroupsWrap}`}>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleGroupVisibility(groupName)}
          >
            <div className="flex items-center">
              <SvgComponent name={"folder"} />
              <span className="ml-2 font-semibold">
                {groupName} ({groups[groupName].length})
              </span>
            </div>
            <button>
              <SvgComponent
                name={
                  activeGroups.includes(groupName) ? "aboveArrow" : "downArrow"
                }
              />
            </button>
          </div>
          {activeGroups.includes(groupName) && (
            <>
              {(selectedType === MediaTypes?.IMAGE ||
                selectedType === MediaTypes?.VIDEO) && (
                <div
                  className={`grid ${
                    selectedType === MediaTypes?.IMAGE
                      ? "grid-cols-3"
                      : selectedType === MediaTypes?.VIDEO
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  } gap-1 p-4 bg-[#f3f5fb] rounded-lg mt-4 max-h-[270px] overflow-y-scroll`}
                >
                  {groups[groupName].map(
                    (item, itemIndex) =>
                      (selectedType === MediaTypes?.IMAGE ||
                        selectedType === MediaTypes?.VIDEO) && (
                        <div
                          key={item.ID}
                          className="relative border-radius-8 cursor-pointer"
                          onMouseEnter={() =>
                            handleMouseEnter(groupName, itemIndex)
                          }
                          onMouseLeave={() => handleMouseLeave(groupName)}
                          style={{ height: "fit-content" }}
                        >
                          {selectedType === MediaTypes?.IMAGE ? (
                            <img
                              className="object-cover rounded-lg"
                              src={item.Content}
                              alt={item.Name}
                              style={{ width: "96px", height: "72px" }}
                            />
                          ) : (
                            <video
                              className="w-[160px] h-[170px] rounded-[5px]"
                              controls
                            >
                              <source src={item.Content} type="video/mp4" />
                            </video>
                          )}
                          {hoveredIndexes[groupName] === itemIndex &&
                            selectedType === MediaTypes?.IMAGE && (
                              <div
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
                                onClick={() => handleImageClick(item.Content)}
                              >
                                <SvgComponent name={"panZoom"} />
                              </div>
                            )}
                        </div>
                      )
                  )}
                </div>
              )}
              {selectedType === MediaTypes?.VOICE && (
                <div
                  className={`grid gap-4 p-4 rounded-lg mt-4 max-h-[270px] overflow-y-scroll`}
                >
                  {groups[groupName].map((item, itemIndex) => (
                    <audio controls className="" key={item.ID}>
                      <source src={item.Content} type="audio/mpeg" />
                    </audio>
                  ))}
                </div>
              )}
              {selectedType === MediaTypes?.TEXT && (
                <div
                  className={`grid gap-4 p-4 rounded-lg mt-4 max-h-[270px] overflow-y-scroll`}
                >
                  {groups[groupName].map((item, itemIndex) => (
                    <div key={item.ID}>
                      <p className="mb-2">
                        <span className="rounded-md border border-[#999] p-1 mr-2 inline-block text-[#999]">
                          {t("Name")}
                        </span>{" "}
                        <span>{item.Name}</span>
                      </p>
                      <p>
                        <span className="rounded-md border border-red-500 p-1 mr-2 inline-block text-[red]">
                          {t("Content")}
                        </span>{" "}
                        <span>{item.Content}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))
    );
  };
  return (
    <div className="flex flex-col gap-3 bg-white shadow-md border-radius-12 p-4 w-full h-full">
      <div className="flex mb-4 text-xs">
        <button
          className={`flex-1 py-2 px-4 flex items-center justify-center rounded-t-md border-b flex-col  ${
            activeMainTab === "Quick Reply"
              ? "text-blue-500  border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveMainTab("Quick Reply")}
        >
          <SvgComponent name={"quickReply"} />
          <p>{t("Quick Reply")}</p>
        </button>
        <button
          className={`flex-1 py-2 px-4 flex items-center justify-center rounded-t-md border-b flex-col ${
            activeMainTab === "User/Group Detail"
              ? "text-blue-500 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveMainTab("User/Group Detail")}
        >
          <SvgComponent name={"userGroupDetail"} />
          <p>{t("User/Group Detail")}</p>
        </button>
      </div>
      {activeMainTab === "User/Group Detail" && <UserGroupDetail  />}
      {activeMainTab === "Quick Reply" && (
        <>
          <div className="flex bg-gray-200 p-1 border-radius-10">
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                activeTab === TagTypes?.MATERIAL_TAG
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(TagTypes?.MATERIAL_TAG)}
            >
              {t("Material Library")}
            </button>
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                activeTab === TagTypes?.CUSTOM_TEXT_TO_SPEECH
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(TagTypes?.CUSTOM_TEXT_TO_SPEECH)}
            >
              {t("Custom Text Speech")}
            </button>
          </div>
          <div className="flex bg-gray-200 p-1 border-radius-10">
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                selectedType === MediaTypes?.IMAGE
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.IMAGE)}
            >
              <SvgComponent name={"gallery"} />
            </button>
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                selectedType === MediaTypes?.VIDEO
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.VIDEO)}
            >
              <SvgComponent name={"videoCamera"} />
            </button>
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                selectedType === MediaTypes?.VOICE
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.VOICE)}
            >
              <SvgComponent name={"voiceCircles"} />
            </button>
            <button
              className={`flex-1 text-xs p-2.5 border-radius-8 ${
                selectedType === MediaTypes?.TEXT
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedType(MediaTypes?.TEXT)}
            >
              <SvgComponent name={"text"} />
            </button>
          </div>
          <div
            className={`flex w-full gap-2.5 ${style.materialSelectContainer} text-[12px] `}
          >
            <div className={`flex space-x-2  ${style.materialSelectWrapper}`}>
              <div className="relative custom-dropdown grow !p-0 !w-[auto]">
                <div
                  className=" bg-[#EEF2FE] h-[100%] p-2 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsSearchOptionsOpen(!isSearchOptionsOpen)}
                >
                  {t(selectedSearchOption?.label)}
                  <span
                    className={`dropdown-arrow ${
                      isSearchOptionsOpen ? "open" : ""
                    } !p-[3px]`}
                  ></span>
                </div>
                {isSearchOptionsOpen && (
                  <ul className="dropdown-list !absolute mt-1 bg-white border border-gray-300 rounded-md z-10">
                    {searchOptions?.map((option) => (
                      <li
                        key={option.value}
                        className="dropdown-item p-2 hover:bg-[#f3f5fb] cursor-pointer"
                        onClick={() => handleSearchOptionClick(option)}
                      >
                        {t(option.label)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                value={searchInput}
                type="text"
                placeholder={t("searchPlaceholder", {
                  selectedSearchOption: t(selectedSearchOption?.label),
                })}
                className="p-2 border border-radius-8 flex-grow border-none"
                onChange={(e) => setSearchInput(e?.target?.value)}
              />
            </div>
            <button
              className={`p-2 bg-gray-200 border-radius-8 ${style.materialResetBtn}`}
              onClick={() => setSearchInput("")}
            >
              <SvgComponent name={"refresh"} />
            </button>
          </div>
          {activeTab === TagTypes?.CUSTOM_TEXT_TO_SPEECH && (
            <div className="flex space-x-2 text-xs">
              <button
                className={`py-3 px-2 border-radius-8 flex-grow  bg-[#EEF2FE] text-[#817F7F]`}
                onClick={() => setShowMaterialTagUpsert(true)}
              >
                {t("Add Group")}
              </button>
              <button
                className={`py-3 px-2 border-radius-8 flex-grow  text-[#817F7F] bg-[#EEF2FE]`}
                onClick={() => setShowTemplateUpsert(true)}
              >
                {t("Add Speech")}
              </button>
            </div>
          )}
          <div className="overflow-auto">{renderGroups()}</div>
        </>
      )}
      {showTemplateUpsert && (
        <TemplateUpsert
          setOpenModal={setShowTemplateUpsert}
          selectedType={selectedType}
          tagOptions={tagOptions}
          fetchMedia={fetchMedia}
          tagTitle={t("Group Name")}
          templateTitle={t("Name")}
          modalTitle={t("Add Custom Text To Speech")}
          tagType={TagTypes?.CUSTOM_TEXT_TO_SPEECH}
          materialOptions={materialOptions}
          handleMaterialOptionClick={handleMaterialOptionClick}
          isMaterialOptionsOpen={isMaterialOptionsOpen}
          setIsMaterialOptionsOpen={setIsMaterialOptionsOpen}
          selectedMaterialOption={selectedMaterialOption}
          setSelectedMaterialOption={setSelectedMaterialOption}
        />
      )}
      {showMaterialTagUpsert && (
        <MaterialTagsUpsert
          setOpenModal={setShowMaterialTagUpsert}
          selectedType={selectedType}
          fetchTags={fetchTags}
          tagType={TagTypes?.CUSTOM_TEXT_TO_SPEECH}
          tagTitle={t("Group")}
        />
      )}
      <ImagePreviewModal
        imageSrc={imageSrc}
        isOpen={imageModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MaterialLibrary;
