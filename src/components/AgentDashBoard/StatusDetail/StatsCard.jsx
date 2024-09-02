import React, { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./statusCard.module.css";
import SvgComponent from "../../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { useFollowerContext } from "../../../Utils/Context/Context";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const StatsCard = ({ title, value }) => {
  const { fetchFriendsGroup, profileData } = useFollowerContext();
  const { t } = useTranslation(); // Initialize useTranslation hook

  const [statsData, setStatsData] = useState([
    { icon: "totalFriends", title: "Total Friends", count: 0 },
    { icon: "totalAccounts", title: "Total Accounts", count: 0 },
    { icon: "totalBanned", title: "Total Banned", count: 0 },
  ]);

  const getAccountStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent/stats`,
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
      if (data?.code === 1000 || data?.code === 200) {
        const updatedStats = statsData?.map((stat) => {
          if (stat.icon === "totalFriends") {
            return { ...stat, count: data?.data?.TotalContacts };
          } else if (stat.icon === "totalAccounts") {
            return { ...stat, count: data?.data?.TotalAssignedAccounts };
          } else if (stat.icon === "totalBanned") {
            return { ...stat, count: data?.data?.TotalBannedAccounts };
          }
          return stat;
        });
        setStatsData(updatedStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getAccountStats();
  }, [fetchFriendsGroup]);

  return (
    <div className={`bg-[#f3f5fb] ${styles.statusCardContainer}`}>
      <div
        className={`bg-white shadow-md rounded-xl p-4 flex items-center ${styles.innerMainCard} !w-56`}
      >
        <div className="flex-shrink-0">
          <SvgComponent name={"agentAvatar"} />
        </div>
        <div className="">
          <h2 className={styles.mainCardNumb}>{profileData?.fullname}</h2>
          <p className={`text-gray-600 ${styles.mainCardTitle}`}>
            {t("Customer Service Account")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {statsData?.map((item, index) => (
          <Card
            key={index}
            icon={item?.icon}
            title={item?.title}
            count={item?.count}
            customClass={"h-[72px]"}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
