import React, { useEffect, useState } from "react";
import TabsAndSubgroup from "./TabsAndSubgroup";
import avatar from "../../../Assets/user.png";
import SvgComponent from "../../SvgComponent/SvgComponent";
import MaterialTagsUpsert from "../../TemplateManagement/MaterialTagsUpsert";
import { TagTypes } from "../../../Utils/templateTypeEnum";
import { useFollowerContext } from "../../../Utils/Context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const FriendsList = () => {
  const groupedData = []
  const { setContactId } = useFollowerContext();
  const { t } = useTranslation();
  const [lists, setLists] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState({
    listIndex: null,
    friendIndex: null,
  });
  const [visibleLists, setVisibleLists] = useState(
    lists.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {})
  );
  const [showMaterialTagUpsert, setShowMaterialTagUpsert] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [isSearchOptionsOpen, setIsSearchOptionsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchOptions = [
    { label: "Groups", value: "Groups" },
    { label: "Friends", value: "Friends" },
  ];
  const [selectedSearchOption, setSelectedSearchOption] = useState(
    searchOptions[0]
  );
  const { fetchFriendsGroup, selectedAccountID } = useFollowerContext();
  const [tags, setTags] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const handleSearchOptionClick = (option) => {
    setSelectedSearchOption(option);
    setIsSearchOptionsOpen(false);
  };

  const toggleListVisibility = (index) => {
    setVisibleLists((prevVisibleLists) => ({
      ...prevVisibleLists,
      [index]: !prevVisibleLists[index],
    }));
  };

  const fetchData = async () => {
    // Fetching data from first API call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/tag/list?limit=&page_no=&name=&tag_type=${TagTypes?.CONTACTS}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const tagsdata = await response.json();
      console.log(tagsdata)
      setTags([...tags, ...tagsdata.data]);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  
    // Fetching data from second API call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/contact/list?limit=&page_no=1&${
          selectedSearchOption?.value === "Groups"
            ? `tag_name=${searchInput}`
            : `contact_name=${searchInput}`
        }&acc_id=${selectedAccountID}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const listdata = await response.json();
      setFriendList([...friendList, ...listdata?.data]);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error(error?.message);
    }
  };
  console.log(tags)
  useEffect(() => {
  selectedAccountID &&  fetchData();
  }, [selectedAccountID,fetchFriendsGroup]);

 const data = ()=>{
 for (let i = 0; i <= tags.length; i++) {
  if (i < tags.length) {
    groupedData.push( {groupname : tags[i].Name,count : 0,datalist : []})
  }else{
    groupedData.push ({ groupname : "ungroupped", count: 0, datalist : [] });
  }
 }
  friendList.reduce((acc, current) => {
     const group = acc.tags && acc.tags.length > 0 ? acc.tags[0].Name : 'ungroupped';
     const currentGroup = groupedData.find((item) => item.groupname === group)
     currentGroup.datalist.push(acc)
     currentGroup.count ++
     return current;
   });
 } 
 friendList.length > 0 && tags.length > 0 && data()
 console.log(groupedData)
 
 return (
  <div className="flex flex-col bg-white shadow-md border-radius-12 p-4 w-full gap-3">
    <TabsAndSubgroup
      setShowMaterialTagUpsert={setShowMaterialTagUpsert}
      searchOptions={searchOptions}
      isSearchOptionsOpen={isSearchOptionsOpen}
      setIsSearchOptionsOpen={setIsSearchOptionsOpen}
      selectedSearchOption={selectedSearchOption}
      handleSearchOptionClick={handleSearchOptionClick}
      setSearchInput={setSearchInput}
      searchInput={searchInput}
    />
    <div className="overflow-auto">
      {groupedData.map((list, listIndex) => (
        <div key={listIndex} className="mb-4">
          <div
            className="border-b pt-4 cursor-pointer"
            onClick={() => toggleListVisibility(listIndex)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-content-center gap-2.5">
                <SvgComponent name={"folder"} />
                <h4 className="text-gray-500 font-semibold text-sm">
                  {list.groupname} ({list.count})
                </h4>
              </div>
              <button className="text-gray-500">
                <SvgComponent name={visibleLists[listIndex] ? "aboveArrow" : "downArrow"} />
              </button>
            </div>
          </div>
          {visibleLists[listIndex] && (
            <div className="mt-2">
              {list.datalist.map((friend, friendIndex) => (
                <div
                  key={friendIndex}
                  className={`flex items-center space-x-4 p-2 border-radius-8 cursor-pointer ${
                    selectedFriend.listIndex === listIndex &&
                    selectedFriend.friendIndex === friendIndex
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-[#f3f5fb]"
                  }`}
                   onClick={()=>{setContactId(friend.id)}}
                >
                  <img
                    src={avatar}
                    alt={friend.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-grow">
                    <h5 className="text-xs font-semibold">{friend.name}</h5>
                    <p className="text-gray-500 font-size-10">
                      {friend.contact_number}
                    </p>
                  </div>
                  <span className="text-gray-500 font-size-10">
                    {friend.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    {showMaterialTagUpsert && (
      <MaterialTagsUpsert
        tagOptions={tagOptions}
        setShowMaterialTagUpsert={setShowMaterialTagUpsert}
        setLists={setLists}
        lists={lists}
        selectedSearchOption={selectedSearchOption}
        tagType={TagTypes?.CONTACTS}
        setOpenModal={setShowMaterialTagUpsert}
      />
    )}
  </div>
);
};


export default FriendsList;
