import React, { useState, useEffect } from "react";
import SvgComponent from "../../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Import 
import SingleSelectDropDown from "../../common/SingleSelectDropDown";
import apiRequest from "../../../Utils/apiRequest";

const CreateCatagoryModal = ({ setOpenModal,setIsRender,isRender,activeTab,options,rowData,currentPage }) => {
  console.log(options)
  const { t } = useTranslation(); // Initialize translation hook
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [catagoryId,setCatagoryId] = useState(null)
  const [catagoryOptions,setCatagoryOptions] = useState([])
  
  useEffect(()=>{
    if(options?.option === "Edit"){
      const name = rowData?.Name || rowData?.Question  
      const description = rowData?.Description || rowData?.Answer 
      setName(name)
      setDescription(description) 
    }
  },[])
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setCatagoryId(option.value)
    setIsOpen(false);
  };
  const onClose = () => {
    setName("")
    setDescription("")
    setOpenModal(false);
  };

  const fetchData = async () => {
    const data = await apiRequest('GET','/faq-category/list?page_no=1&limit=&name=')
    const options = (data?.data && data.data.length > 0) && data.data.map((item)=>{return {value : item.ID,label : item.Name}})
    setCatagoryOptions([...catagoryOptions,...options])
  };
  useEffect(()=>{
  activeTab === "qa" && fetchData();
  },[activeTab])

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        if(activeTab === "catagory"){
          if (options?.option === "Edit") {
            const response = await apiRequest('PUT',`/faq-category/update?id=${options.id}`,{name,description})
          toast.success(response.data)
          setIsRender(!isRender)
          }else if(options?.option === "Delete"){
            const response = await apiRequest('DELETE',`/faq-category/delete?id=${options.id}`)
          toast.success(response.data) 
          setIsRender(!isRender)
          }else{
            const response = await apiRequest('POST','/faq-category/create',{name,description})
            toast.success(response.data);
            currentPage(1) 
            setIsRender(!isRender)
          }
          
        }else{
          if (options?.option === "Edit") {
             const response = await apiRequest('PUT','/faq/update',{
              category_id: rowData.category_id,
              id: options.id,
              question: name,
              answer: description,
            }) 
            toast.success(response.data);
            setIsRender(!isRender)
          }else if(options?.option === "Delete"){
            const response = await apiRequest('DELETE',`/faq/delete?id=${options.id}`)
          toast.success(response.data)
          setIsRender(!isRender)
          }else{
            if (!catagoryId) {
              toast.error('Please select a catagory to save FAQ')
              return
            }
             await apiRequest('POST','/faq/create',{
              category_id : catagoryId,
              question : name,
              answer : description
            })
            toast.success('FAQ has been created successfully')
            currentPage(1)
            setIsRender(!isRender)
          }
          
        }
        setIsRender(!isRender)
        setOpenModal(false)  
      } catch (error) {
        toast.error(`An error occurred: ${error.message}`);
      }
  };
  const placeholder = activeTab === "catagroy"? "Enter Catagory Description" : "Enter Q/A Description"
  console.log(placeholder)
  
  return (options?.option === "Edit" || options?.option === "create") ?
   (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{activeTab === "catagory"? options?.option === "Edit"? "Edit Catagory" : "Create Catagory" : options?.option === "Edit"? "Edit Q/A" : "Create Q/A" }</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-[20px] ">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {activeTab === "catagory"? options?.option === "Edit"? "Edit Catagory" : "Create Catagory" : options?.option === "Edit"? "Edit Q/A" : "Create Q/A"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] w-full"
                placeholder="enter Name"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {activeTab === "catagory"? options?.option === "Edit"? "Edit Catagory" : "Create Catagory" : options?.option === "Edit"? "Edit Q/A" : "Create Q/A"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] w-full h-20"
                placeholder="Enter Description"
                required
              />
            </div>
            {activeTab === "qa" && <SingleSelectDropDown
              label={t("catagory Name")}
              Options={catagoryOptions}
              handleOptionClick={handleOptionClick}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedOption={selectedOption}
              defaultSelected={t("choose catagory")}
            />}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >{activeTab === "catagory"? options?.option === "Edit"? "Edit Catagory" : "Create Catagory" : options?.option === "Edit"? "Edit Q/A" : "Create Q/A"}</button>
          </div>
        </form>
      </div>
    </div>
  ) :  (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{t("Delete Catagory")}</h2>
        <div>Are Yoy sure to want to delete {activeTab === "catagory" ? "catagory" : "FAQ"}</div>
        <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {activeTab === "catagory"? "Delete Catagory" : "Delete FAQ"}
            </button>
          </div>
      </div>
    </div>
  )
};

export default CreateCatagoryModal;
