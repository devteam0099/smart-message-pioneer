import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, entriesPerPage, onEntriesChange, setCurrentPage }) => {
  const [visiblePages, setVisiblePages] = useState([]);
  useEffect(() => {
    updateVisiblePages(currentPage);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    // if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
      updateVisiblePages(page);
    // }
  };

  const updateVisiblePages = (page) => {
    if (totalPages <= 3) {
      setVisiblePages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } else if (page === 1) {
      setVisiblePages([1, 2, 3]);
    } else if (page === totalPages) {
      setVisiblePages([totalPages - 2, totalPages - 1, totalPages]);
    } else {
      setVisiblePages([page - 1, page, page + 1]);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white mx-[-32px] absolute bottom-0 w-[100%]">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Page</span>
        <input
          type="text"
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="w-10 px-2 py-1 border rounded text-center"
        />
        <span className="text-gray-500">of {totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <button
            className="px-3 py-1 rounded bg-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt;
          </button>
        )}
        {visiblePages?.map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="px-3 py-1 rounded bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &gt;
          </button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Entries</span>
        <div className="relative">
          <select
            className="px-3 py-1 !pl-2 w-[65px] border rounded bg-gray-100 text-gray-700 appearance-none"
            value={entriesPerPage}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.25 7.5L10 12.25 14.75 7.5H5.25z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
