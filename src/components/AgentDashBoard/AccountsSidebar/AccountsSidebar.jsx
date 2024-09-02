import React, { useState, useEffect } from "react";
import style from "./AccountsSidebar.module.css";
import SvgComponent from "../../SvgComponent/SvgComponent";
import Search from "../../search/Search";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { useFollowerContext } from "../../../Utils/Context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Function to generate a random color from the provided color pairs
const getRandomColorPair = () => {
  const colorPairs = [
    { bg: "bg-red-100", text: "text-red-500" },
    { bg: "bg-green-100", text: "text-green-500" },
    { bg: "bg-blue-100", text: "text-blue-500" },
    { bg: "bg-yellow-100", text: "text-yellow-500" },
    { bg: "bg-purple-100", text: "text-purple-500" },
    { bg: "bg-pink-100", text: "text-pink-500" },
    { bg: "bg-indigo-100", text: "text-indigo-500" },
  ];
  return colorPairs[Math.floor(Math.random() * colorPairs.length)];
};

const AccountsSidebar = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const { setSelectedAccountId, selectedAccountID } = useFollowerContext();
  const filterAccounts = (searchTerm) => {
    if (searchTerm) {
      const filtered = accounts.filter((account) =>
        account.PhoneNumber.includes(searchTerm)
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  };

  const resetAccounts = () => {
    setFilteredAccounts(accounts);
  };
  const handleSearch = () => {
    setOpenSearch(!openSearch);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/account/list`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
        const data = await response.json();
        if (data?.code === 1000 || data?.code === 200) {
          const formattedAccounts = data?.data?.map((account) => ({
            ID: account?.Id,
            PhoneNumber: account?.PhoneNumber,
            OnlineStatus: account?.OnlineStatus,
            label: account?.PhoneNumber.substring(0, 4), // Using NumberID as label
            colorPair: getRandomColorPair(), // Assign random color pair
          }));
          setSelectedAccountId(formattedAccounts?.[0]?.ID);
          setAccounts(formattedAccounts);
          setFilteredAccounts(formattedAccounts);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error(error?.message);
      }
    };

    fetchAccounts();
  }, []);
  return (
    <div
      className={`${style.AccountsSidebarContainer} bg-white p-4 w-20 flex flex-col items-center space-y-4 border-radius-12`}
    >
      <h3 className="text-gray-500 text-xs font-semibold">{t("Accounts")}</h3>
      <div
        className={`tooltip ${style.accountItem} ${style.accountSearch} relative`}
        onClick={handleSearch}
      >
        {" "}
        <p>
          <SvgComponent name={"SearchNormal"} />
        </p>
      </div>

      {filteredAccounts?.length > 0 &&
        filteredAccounts?.map((account, index) => {
          const { bg, text } = account?.colorPair;
          return (
            <div
              key={account?.ID}
              className={`tooltip-right tooltip my-anchor-element${index} ${
                style.accountItem
              } ${bg} ${
                selectedAccountID === account?.ID
                  ? "border-2 border-blue-500"
                  : ""
              } ${selectedAccountID === account?.ID ? "text-blue-500" : text}`}
              onClick={() => {
                setSelectedUser(index);
                setSelectedAccountId(account?.ID);
              }}
              onMouseEnter={() => setHoveredUser(index)}
              onMouseLeave={() => setHoveredUser(null)}
              // data-tooltip={`${account?.PhoneNumber} Whatsapp`}
            >
              <p className="text-base font-medium">{account?.label}</p>
              {/* <span className="tooltiptext text-xs">
                {account?.PhoneNumber}
              </span> */}
              {account?.OnlineStatus && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      <div className="absolute left-[77px]">
        {openSearch && (
          <Search
            filterAccounts={filterAccounts}
            resetAccounts={resetAccounts}
          />
        )}
      </div>

      <Tooltip
        anchorSelect={`.my-anchor-element${hoveredUser}`}
        place="right"
        clickable
        style={{ marginTop: "-3px", borderRadius: "8px", right: "75%" }}
      >
        {filteredAccounts?.[hoveredUser]?.PhoneNumber}
      </Tooltip>
    </div>
  );
};

export default AccountsSidebar;
