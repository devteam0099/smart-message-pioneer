import React, { useEffect,useState } from "react";
import Header from "../Header/Header";
import StatsCard from "./StatusDetail/StatsCard";
import AccountsSidebar from "./AccountsSidebar/AccountsSidebar";
import FriendsList from "./FriendList/FriendsList";
import Chat from "./Chat/Chat";
import MaterialLibrary from "./RightPanel/MaterialLibrary";
import UserGroupDetail from "./RightPanel/UserGroupDetail";

const AgentDashBoard = () => {
  const [userId,setUserId] = useState()
  useEffect(() => {
    console.log("document.cookie", document.cookie)
  },[])

  const dataHandler = (id)=>{
    console.log(id)
    setUserId(id)
  }
  return (
    //if no data then below comented code
    //   <div className="flex-grow bg-gray-50 p-4 flex justify-center items-center">
    //   <span className="text-gray-400">Start Conversation</span>
    // </div>
    <div className="flex flex-col h-screen">
      <Header />
      <StatsCard />
      <div
        className="flex flex-grow bg-[#f3f5fb] p-4 gap-4 pt-0 min-h-screen"
        style={{ maxHeight: "100%" }}
      >
        {/* <div className="w-1/4"> */}
        {/* <Sidebar /> */}
        <div className="flex bg-[#f3f5fb] gap-4">
          <AccountsSidebar />
          {/* <div className="flex-grow p-6"> */}
          <FriendsList data={document.cookie}  />
          {/* </div> */}
        </div>
        {/* </div> */}
        <div className="w-2/4 flex flex-col flex-1">
          {/* <div className="grid grid-cols-4 gap-4 p-4 bg-white shadow">
            <StatsCard title="Total Friends" value="0" />
            <StatsCard title="New Friends" value="0" />
            <StatsCard title="Today's Heavy Fans" value="0" />
            <StatsCard title="Total Duplicates" value="0" />
          </div> */}
          <Chat />
        </div>
        <div className="h-full" style={{ width: "23%" }}>
          <MaterialLibrary  />
        </div>
      </div>
    </div>
  );
};

export default AgentDashBoard;
