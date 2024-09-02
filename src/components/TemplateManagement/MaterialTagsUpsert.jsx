import React, { useState, useRef, useEffect } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { TagTypes } from "../../Utils/templateTypeEnum";
import { useTranslation } from "react-i18next";

const MaterialTagsUpsert = ({
  selectedType,
  setOpenModal,
  fetchTags,
  setTagId,
  tagId,
  tagType,
  tagTitle,
}) => {
  const { t } = useTranslation();
  const [tagName, setTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setOpenModal(false);
    setTagId && setTagId(null);
  };

  const fetchSingletemplate = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag?tag_id=${tagId}`,
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
        // console.log("data?.data", data?.data);
        setTagName(data?.data?.Name);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    if (tagId) {
      // console.log("first");
      fetchSingletemplate();
    }
  }, [tagId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let url;
      let method;
      let body;
      if (tagId) {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/update`;
        method = "PUT";
        body = JSON.stringify({
          name: tagName,
          id: tagId,
        });
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/create`;
        method = "POST";
        body = JSON.stringify({
          name: tagName,
          type: tagType,
        });
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
        credentials: "include",
      });
      const data = await response.json();
      if (data?.code === 200 || data?.code === 1000) {
        toast.success(
          t(`Material tag ${tagId ? "updated" : "created"} successfully`)
        );
        if (tagType !== TagTypes?.CONTACTS) {
          fetchTags();
        }
        setIsLoading(false);
        onClose();
      } else {
        toast.error(
          t(`Failed to ${tagId ? "update" : "create"} material tag!`)
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {t("Add")} {t(tagTitle)}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t(tagTitle)} {t("Name")}
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
              placeholder={t("Enter Group name")}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  <i class="fa fa-circle-o-notch fa-spin mr-1"></i>
                  {t("Processing")}
                </>
              ) : tagId ? (
                t("Edit")
              ) : (
                t("Create")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialTagsUpsert;
