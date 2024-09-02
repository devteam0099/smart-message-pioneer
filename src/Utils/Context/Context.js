import React, { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

export const useFollowerContext = () => {
  return useContext(Context);
};

export const FollowerContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );
  const [fetchFriendsGroup, setFetchFriendsGroup] = useState(false);
  const accId = sessionStorage.getItem("selected_account_id");
  const [selectedAccountID, setSelectedAccountId] = useState(accId);
  const [contactId,setContactId] = useState()

  const value = {
    profileData,
    setProfileData,
    selectedAccountID,
    setSelectedAccountId,
    setFetchFriendsGroup,
    fetchFriendsGroup,
    contactId,
    setContactId
  };
  
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
