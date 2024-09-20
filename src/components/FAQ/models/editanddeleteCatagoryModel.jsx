import React, { useState, useRef, useEffect } from "react";
import SvgComponent from "../../SvgComponent/SvgComponent";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { toast } from "react-toastify";

const EditAndDeleteModel = ({ setOpenModal,isRender,setIsRender,options,rowData,activeTab }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const [newName, setNewName] = useState(rowData.Name);
  const [newDescription, setNewDescription] = useState(rowData.Description);

  useEffect(()=>{
    const name = rowData.Name || rowData.Question
    const description = rowData.Description || rowData.Answer
    setNewName(name)
    setNewDescription(description)
  },[])
  
  const onClose = () => {
    setOpenModal(false);
  };
  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!(newName && newDescription)) {
      alert("Question and Answer fields shoud not be empty");
      return;
    }
  try {
    //confifured
    if (activeTab === "catagory") {
      await fetch(`http://localhost:8000/api/doublefollowers/v1/faq-category/update?id=${options.id}`,{
        method : 'PUT',
        headers : {
            'Content-Type': 'application/json',
            accept : 'application/json'
        },
        credentials : 'include',
        body : JSON.stringify({name : newName,description : newDescription})
    })
    toast.success('catagory has been updated successfully')
    } else {
      await fetch("http://localhost:8000/api/doublefollowers/v1/faq/update", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category_id: rowData.category_id,
          id: options.id,
          question: newName,
          answer: newDescription,
        }),
      });
      toast.success("Q/A has been updated successfully");
    }
    setIsRender(!isRender)
    setOpenModal(false)
  } catch (error) {
      toast.error(error)
  }
  };

  const deleteData = async()=>{
    const cred = {
      method : 'DELETE',
      headers : {
          'Content-Type': 'application/json',
          accept : "application/json"
      },
      credentials : 'include'
  }
  try {
    activeTab === "catagory"?
     await fetch(`http://localhost:8000/api/doublefollowers/v1/faq-category/delete?id=${options.id}`,cred) :
     await fetch(`http://localhost:8000/api/doublefollowers/v1/faq/delete?id=${options.id}`,cred)
  } catch (error) {
    toast.error(error)
  }
  activeTab === "catagory"? toast.success('catagory has been deleted successfully') :
  toast.success("FAQ has been deleted successfully")
  setIsRender(!isRender)
  setOpenModal(false)
  }

  return options.option === "Edit"?   (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{activeTab === "catagory"? "Edit Catagory" : "Edit FAQ"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-[20px] ">
            <div className="w-full" >
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {activeTab === "catagory" ? "Catagory Name" : "FAQ Name"}
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] w-full"
                placeholder={activeTab === "catagory" ? "Catagory Name" : "FAQ Name"}
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {activeTab === "catagory" ? "Catagory Description" : "FAQ Description"}
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="p-2 border-2 activeInput rounded-[8px] w-full h-20"
                placeholder={activeTab === "catagory" ? "Catagory Description" : "FAQ Description"}
                required
              />
            </div>
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
            >
              {activeTab === "catagory" ? "Edit Catagory" : "Edit FAQ"}
            </button>
          </div>
        </form>    

      </div>
    </div>
  )
  :    (
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
              onClick={deleteData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {activeTab === "catagory"? "Delete Catagory" : "Delete FAQ"}
            </button>
          </div>
      </div>
    </div>
  )
};

export default EditAndDeleteModel;
