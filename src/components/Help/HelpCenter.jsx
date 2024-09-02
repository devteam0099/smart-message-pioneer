import React, { useState } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import BreadCrumbs from "../common/BreadCrumbs";
import HelpCenterContent from "./HelpCenterContent";

const HelpCenter = () => {
  const breadcrumbItems = ["User", "Help"];
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="relative w-full h-[300px] rounded-[12px] flex items-center justify-center overflow-hidden mb-[24px] help-center-container">
        <div className="text-center z-10">
          <h1 className="text-2xl font-semibold text-[#1E2A54]">Help Centre</h1>
          <p className="text-[#8A94B3]">Help Centre</p>
          <div className="mt-6 flex justify-center">
            <div className="relative template-search-wrapper">
              <input
                value={searchInput}
                type="text"
                placeholder="Search by topic"
                className="w-[286px] px-4 py-2 !pl-9 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                <SvgComponent name={"GraySearchIcon"} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <HelpCenterContent searchInput={searchInput} />
    </>
  );
};

export default HelpCenter;
