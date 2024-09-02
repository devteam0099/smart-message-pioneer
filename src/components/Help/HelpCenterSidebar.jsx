import React, { useState } from "react";

const HelpCenterSidebar = ({
  setSelectedSection,
  selectedSection,
  sections,
}) => {
  const [expandedSection, setExpandedSection] = useState("");

  const handleSectionClick = (section) => {
    if (section.items && section.items.length > 0) {
      setExpandedSection(
        expandedSection === section.title ? "" : section.title
      );
    } else {
      setSelectedSection(section.title);
      setExpandedSection(""); // Collapse any expanded sections if a single item is clicked
    }
  };

  const handleItemClick = (item) => {
    setSelectedSection(item);
  };

  return (
    <div className="w-1/4 bg-white p-4 rounded-lg shadow">
      {sections.map((section, index) => (
        <div key={index}>
          <div
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => handleSectionClick(section)}
          >
            <h3
              className={`font-semibold ${
                selectedSection === section.title ||
                expandedSection === section.title
                  ? "text-[#696CFF]"
                  : "text-gray-600"
              }`}
            >
              {section.title}
            </h3>
            {section.items && section.items.length > 0 && (
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  expandedSection === section.title ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
          {expandedSection === section.title && section.items && (
            <div className="pl-4">
              {section.items.map((item, subIndex) => (
                <div
                  key={subIndex}
                  className={`cursor-pointer py-2 pl-2 rounded-lg ${
                    selectedSection === item
                      ? "bg-[#f5f6ff] text-[#696CFF]"
                      : "text-gray-600"
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HelpCenterSidebar;
