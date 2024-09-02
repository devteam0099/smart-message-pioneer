import React, { useState } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import faqData, { categories } from "./faqData";
import BreadCrumbs from "../common/BreadCrumbs";

const FAQSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("General Queries");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const breadcrumbItems = ["User", "FAQ"];
  const handleQuestionClick = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="mb-4">
        <h1 className="font-bold text-[18px] ">Frequently Asked Questions</h1>
      </div>
      <div className="flex gap-[24px]">
        {/* Sidebar */}
        <div className="w-1/4">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`p-4 mb-4 bg-white cursor-pointer rounded-[8px] ${
                selectedCategory === category.name
                  ? "border border-[#696CFF]"
                  : ""
              }`}
              onClick={() => {
                setSelectedCategory(category.name);
                setExpandedQuestion(null); // Reset expanded question when category changes
              }}
            >
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-[#687779]">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-3/4 bg-white p-8 rounded-[12px] ">
          <h2 className="text-2xl font-semibold mb-4">{selectedCategory}</h2>
          <p className="text-gray-500 mb-8">
            {
              categories.find((category) => category.name === selectedCategory)
                ?.description
            }
          </p>
          {faqData[selectedCategory]?.map((item, index) => (
            <div
              key={index}
              className={`p-4 mb-4 cursor-pointer  ${
                expandedQuestion === index
                  ? " bg-[#f5f6ff] rounded-[12px] "
                  : ""
              }`}
              onClick={() => handleQuestionClick(index)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">{item.question}</h4>
                <span>
                  {expandedQuestion === index ? (
                    <SvgComponent name={"MinusCircleIcon"} />
                  ) : (
                    <SvgComponent name={"AddCircleIcon"} />
                  )}
                </span>
              </div>
              {expandedQuestion === index && (
                <p className="mt-4 text-[#687779] ">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQSection;
