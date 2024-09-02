import React, { useState } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import { useTranslation } from "react-i18next";

const Search = ({ filterAccounts, resetAccounts }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    filterAccounts(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    resetAccounts();
  };

  return (
    <div className="w-[270px] px-[12px] pt-[14px] pb-[12px] rounded-[12px] bg-[white] m-6 relative shadow-[4px_4px_40px_0px_rgba(233,233,233,1)] mt-[-5px]">
      <div className="absolute top-[21px] left-[-10px]">
        <SvgComponent name="coneCurveIcon" />
      </div>
      <div className="flex items-center border border-[#DDDDF6] rounded-[8px] py-[3px] px-1 bg-white">
        <input
          type="text"
          placeholder={t("Search Accounts")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none outline-none p-2 text-gray-700 rounded-[8px] text-[14px]"
        />
        <button
          className="bg-[#696CFF] hover:bg-indigo-600 text-white p-[11px] rounded-[9px] ml-2"
          onClick={handleSearch}
        >
          <span role="img" aria-label="search-icon">
            <SvgComponent name="searchIcon" />
          </span>
        </button>
      </div>
      <div className="text-right pt-2">
        <button
          className="mr-2 text-[#696CFF] cursor-pointer text-[14px] underline"
          onClick={handleReset}
        >
          {t("Reset")}
        </button>
      </div>
    </div>
  );
};

export default Search;
