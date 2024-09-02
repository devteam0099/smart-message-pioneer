import React from "react";
import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import userImage from "../../../Assets/download.jpeg";
import materialImage from "../../../Assets/materilImage.png";
import SvgComponent from "../../SvgComponent/SvgComponent";
import style from "./RightPanel.module.css";
import { toast } from "react-toastify";
import { useFollowerContext } from "../../../Utils/Context/Context";

const UserGroupDetail = (props) => {
  const {contactId} = useFollowerContext();
  const [data,setData] = useState(null)
  const { t } = useTranslation(); // Initialize translation function

  const materials = [
    materialImage,
    materialImage,
    materialImage,
    materialImage,
    materialImage,
    materialImage,
    materialImage,
    materialImage,
    materialImage, // Add as many images as you have
  ];
  const fetchData = async()=>{
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/contact/detail?contact_id=${contactId}`,
        {
          method : 'GET',
          headers : {
            Accept: "application/json",
              "Content-Type": "application/json",
          },
          credentials : 'include'
        }
       )
       const data = await resp.json()
       setData(data.data)
   
    } catch (error) {
      toast.error(error?.message);
    }
  }
  
   useEffect(()=>{ 
     if (contactId) {
       fetchData() 
     }
   },[contactId])
  return (
    <>
      <div className="flex justify-center items-center mt-4">
        <div className="relative">
          <img
            src={userImage}
            alt={t("customer")}
            className={`h-32 w-32 rounded-full ${style.customerImage}`}
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t(data?.Name)}</h2>
        <p className="text-gray-500">{data?.ContactNumber}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">{t("info")}</h3>
        <p className="text-gray-500">{t("Spring is coming 🌱")}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">{t("Media, Links and Documents")}</h3>
        <div className="flex overflow-auto mt-2 gap-1.5">
          {materials.map((src, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={src}
                alt={`${t("media")} ${index + 1}`}
                className="h-20 w-24 border-radius-8"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-1.5 items-center">
        <SvgComponent name={"star"} />
        <p className="text-gray-500"> {t("Marked messages")}</p>
      </div>
    </>
  );
};

export default UserGroupDetail;
