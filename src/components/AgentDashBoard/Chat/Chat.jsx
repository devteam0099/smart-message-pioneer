import React from "react";
import userImage from "../../../Assets/user.png";
import style from "./Chat.module.css";
import SvgComponent from "../../SvgComponent/SvgComponent";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();

  const messages = [
    {
      sender: t("Customer"),
      message: t("messageCustomer1"), // Localization key for customer message
      time: "1:16 PM",
      date: t("Yesterday"),
      avatar: userImage,
      isAgent: false,
      status: t("Read"),
    },
    {
      sender: t("Customer Service Agent"),
      message: t("messageAgent1"), // Localization key for agent message
      time: "1:16 PM",
      date: t("Yesterday"),
      avatar: userImage,
      isAgent: true,
      status: t("Read"),
    },
    {
      sender: t("Customer"),
      message: t("messageCustomer2"), // Localization key for customer message
      time: "1:16 PM",
      date: t("Today"),
      avatar: userImage,
      isAgent: false,
      status: t("Sent"),
    },
    {
      sender: t("Customer Service Agent"),
      message: t("messageAgent2"), // Localization key for agent message
      time: "1:16 PM",
      date: t("Today"),
      avatar: userImage,
      isAgent: true,
      status: t("Sent"),
    },
  ];

  const renderDateLine = (currentDate, previousDate) => {
    if (currentDate !== previousDate) {
      return (
        <div className="flex justify-center items-center my-4 text-xs">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500">{currentDate}</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-md border-radius-12 chatContainer flex-grow">
      <div
        className="flex items-center p-4 relative"
        style={{ boxShadow: "0px 4px 4px 0px #2455FF0D" }}
      >
        <img
          src={userImage}
          alt={t("Customer")}
          className="h-10 w-10 rounded-full mr-3"
        />
        <h2 className="text-base font-semibold">{t("Customer")}</h2>
        <span
          className={`ml-auto h-3 w-3 bg-green-500 rounded-full online-tag ${style.onlineTag}`}
        ></span>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages?.length > 0 ? (
          messages.map((msg, index) => (
            <React.Fragment key={index}>
              {renderDateLine(
                msg.date,
                index > 0 ? messages[index - 1].date : null
              )}
              <div className={`flex ${msg.isAgent ? "justify-end" : ""}`}>
                <div
                  className={`flex gap-2 ${
                    msg.isAgent ? "flex-row-reverse" : ""
                  } items-end space-x-2 space-x-reverse`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="h-8 w-8 rounded-full self-baseline"
                  />
                  <div
                    className={`flex flex-col gap-2.5 ${
                      msg.isAgent ? "items-end" : "items-start"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        msg.isAgent ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <div
                      className={`max-w-xs p-2 rounded-lg ${
                        msg.isAgent
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-[#f3f5fb] text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      {msg.isAgent &&
                        (msg.status === t("Read") ? (
                          <SvgComponent name={"doubleTick"} />
                        ) : (
                          <SvgComponent name={"singleTick"} />
                        ))}
                      <span className="text-xs">{msg.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="icon-wrapper bg-white p-6 rounded-full shadow-custom">
              <SvgComponent name={"chatBox"} />
            </div>
            <button className="start-conversation-button bg-white mt-6 px-6 py-3 rounded-full shadow-custom text-[#939FBF] text-lg">
              {t("Start Conversation")}
            </button>
          </div>
        )}
      </div>
      <div className="relative" style={{ padding: "1rem" }}>
        <input
          type="text"
          placeholder={t("Type here...")}
          className="w-full p-2 border border-radius-8 bg-blue-100 text-xs"
          style={{ padding: "1rem 0.5rem" }}
        />
        <span className={`${style.sendMessagebtn}`}>
          <SvgComponent name={"sendMessage"} />
        </span>
      </div>
    </div>
  );
};

export default Chat;
