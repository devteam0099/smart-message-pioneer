import React, { useState, useMemo } from "react";
import { content, sections } from "./helpData";
import HelpCenterSidebar from "./HelpCenterSidebar";

const HelpCenterContent = ({ searchInput }) => {
  const [selectedSection, setSelectedSection] = useState("Introduction");

  // Filter sections based on the search input
  const filteredSections = useMemo(() => {
    if (!searchInput) return sections;

    const lowerSearchInput = searchInput.toLowerCase();

    return sections
      .map((section) => {
        const filteredItems = section.items.filter((item) =>
          item.toLowerCase().includes(lowerSearchInput)
        );

        // Include the section only if it has matching items or if its title matches the search
        if (
          filteredItems.length > 0 ||
          section.title.toLowerCase().includes(lowerSearchInput)
        ) {
          return {
            ...section,
            items: filteredItems,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [searchInput]);

  return (
    <div className="flex">
      <HelpCenterSidebar
        sections={filteredSections}
        setSelectedSection={setSelectedSection}
        selectedSection={selectedSection}
      />
      <div className="w-3/4 bg-white p-8 rounded-lg shadow ml-4">
        {content[selectedSection]}
      </div>
    </div>
  );
};

export default HelpCenterContent;
