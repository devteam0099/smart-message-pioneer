import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SvgComponent from "../SvgComponent/SvgComponent";
import "./sidebar.css";
import { useFollowerContext } from "../../Utils/Context/Context";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { profileData, setProfileData } = useFollowerContext();

  const [menuItems, setMenuItems] = useState(
    profileData?.role === "USER"
      ? [
          {
            name: "Account Management",
            icon: "account",
            route: "/account-management",
            active: true,
          },
          {
            name: "Template Management",
            icon: "template",
            route: "/template-management",
            active: false,
          },
          {
            name: "Agent Management",
            icon: "agent",
            route: "/agent-management",
            active: false,
          },
          {
            name: "Settings",
            icon: "setting",
            route: "/settings",
            active: false,
          },
          {
            name: "Help",
            icon: "help",
            route: "/help",
            active: false,
          },
          {
            name: "FAQ",
            icon: "faq",
            route: "/admin/FAQs",
            active: true,
          },
          {
            name: "Contact Support",
            icon: "contact",
            route: "/contact-support",
            active: false,
          },
        ]
      : [
          {
            name: "User Management",
            icon: "agent",
            route: "/admin/user-management",
            active: true,
          },
          {
            name: "Ticket Management",
            icon: "contact",
            route: "/admin/ticket-management",
            active: false,
          },
          {
            name: "Settings",
            icon: "setting",
            route: "/admin/settings",
            active: false,
          },
          {
            name: "FAQs",
            icon: "faq",
            route: "/admin/FAQS",
            active: true,
          }
        ]
  );

  const handleItemClick = (index) => {
    const newMenuItems = menuItems?.map((item, idx) => ({
      ...item,
      active: idx === index,
    }));
    setMenuItems(newMenuItems);
    navigate(menuItems[index]?.route);
  };

  useEffect(() => {
    const updatedMenuItems = menuItems.map((item) => ({
      ...item,
      active: location.pathname.includes(item.route),
    }));
    setMenuItems(updatedMenuItems);
  }, [location.pathname]);

  return (
    <div className="w-64 bg-white shadow-md sidebar-container">
      <div className="p-4 text-sm">
        <div className="mb-4">
          <span className="text-gray-500">
            {profileData?.role === "USER" ? t("User") : t("Admin")}
          </span>
        </div>
        {menuItems?.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-3 my-2 rounded-md cursor-pointer ${
              item.active ? "bg-blue-100 text-blue-500 active" : "text-gray-500"
            }`}
            onClick={() => handleItemClick(index)}
          >
            <span className="w-6 h-6 mr-2">
              <SvgComponent name={item?.icon} />
            </span>
            <span>{t(item.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
