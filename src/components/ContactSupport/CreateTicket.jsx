import React, { useEffect, useState } from "react";
import BreadCrumbs from "../common/BreadCrumbs";
import SingleSelectDropDown from "../common/SingleSelectDropDown";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([
    {
      label: "Account",
      value: "Account",
    },
    {
      label: "Template",
      value: "Template",
    },
    {
      label: "Agent",
      value: "Agent",
    },
    {
      label: "Settings",
      value: "Settings",
    },
    {
      label: "Other",
      value: "Other",
    },
  ]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const [isCategoryOpen, SetIsCategoryOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // For the uploaded file
  const [fileType, setFileType] = useState(null); // For storing the type of the file (IMAGE/VIDEO)

  const severityOptions = [
    {
      label: (
        <div className="flex items-start">
          <span className="text-red-500 mr-2">●</span>
          <div>
            <div className="font-semibold">Severity 1</div>
            <div className="text-sm text-gray-500">
              Critical: An error or bug is completely preventing use of the
              service.
            </div>
          </div>
        </div>
      ),
      value: "Sev 1",
    },
    {
      label: (
        <div className="flex items-start">
          <span className="text-yellow-500 mr-2">●</span>
          <div>
            <div className="font-semibold">Severity 2</div>
            <div className="text-sm text-gray-500">
              High: An error or bug is degrading some aspect of the service.
            </div>
          </div>
        </div>
      ),
      value: "Sev 2",
    },
    {
      label: (
        <div className="flex items-start">
          <span className="text-blue-500 mr-2">●</span>
          <div>
            <div className="font-semibold">Severity 3</div>
            <div className="text-sm text-gray-500">
              Medium: An error or bug is causing issues but the service is
              generally still usable.
            </div>
          </div>
        </div>
      ),
      value: "Sev 3",
    },
    {
      label: (
        <div className="flex items-start">
          <span className="text-gray-500 mr-2">●</span>
          <div>
            <div className="font-semibold">Severity 4</div>
            <div className="text-sm text-gray-500">
              Low: A warning or potential bug appears but which doesn't degrade
              use of the service.
            </div>
          </div>
        </div>
      ),
      value: "Sev 4",
    },
    {
      label: (
        <div className="flex items-start">
          <span className="text-gray-500 mr-2">●</span>
          <div>
            <div className="font-semibold">Severity 5</div>
            <div className="text-sm text-gray-500">
              Info: General question or feedback on access or use of the
              service.
            </div>
          </div>
        </div>
      ),
      value: "Sev 5",
    },
  ];

  const [selectedSeverityOption, setSelectedSeverityOption] = useState(null);
  const [isSeverityOpen, SetIsSeverityOpen] = useState(false);
  const breadcrumbItems = [
    { label: "User" },
    { label: "Contact Support", route: "/contact-support" },
    { label: "Create Ticket" },
  ];
  // const [userAgents, setUserAgents] = useState([]);
  // const [searchInput, setSearchInput] = useState("");
  // const [selectedAgentId, setSelectedAgentId] = useState("");
  const handleSeverityOptionClick = (option) => {
    setSelectedSeverityOption(option);
    SetIsSeverityOpen(false);
  };
  const handleCategoryOptionClick = (option) => {
    setSelectedCategoryOption(option);
    SetIsCategoryOpen(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith("image/")
        ? "IMAGE"
        : file.type.startsWith("video/")
        ? "VIDEO"
        : null;
  
      if (fileType) {
        setSelectedFile(file);
        setFileType(fileType);
      } else {
        // Display a toast notification if the file type is not allowed
        toast.error("Unsupported file type. Please upload an image or video file.");
      }
    }
  };
  // const fetchUserAgents = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent/list?limit=&page_no=1&name=${searchInput}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //       }
  //     );
  //     const result = await response?.json();

  //     if (result?.code === 200 || result?.code === 1000) {
  //       // Map the data to add initials, color, and textColor
  //       const formattedUsers = result?.data?.map((user) => {
  //         const initials = user?.Fullname?.split(" ")
  //           .map((name) => name?.[0])
  //           .join("");
  //         const randomIndex = Math.floor(Math.random() * colors.length);
  //         return {
  //           ...user,
  //           initials,
  //           color: colorPairs[randomIndex]?.bg,
  //           textColor: colorPairs[randomIndex]?.text,
  //         };
  //       });
  //       setUserAgents(formattedUsers);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user agents:", error);
  //     toast.error(error?.message);
  //   }
  // };

  //   useEffect(() => {
  //     fetchUserAgents();
  //   }, []);
  // useEffect(() => {
  //   if (searchInput) {
  //     fetchUserAgents();
  //   } else {
  //     setUserAgents([]);
  //   }
  // }, [searchInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("status", "Action Required");
    formData.append("severity", selectedSeverityOption?.value);
    formData.append("category", selectedCategoryOption?.value);

    if (selectedFile) {
      formData.append("content", selectedFile);
      formData.append("file_type", fileType);
    }

    try {
      const url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/ticket/create`;
      const method = "POST";
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (data?.code === 1000 || data?.code === 200) {
        toast.success("Ticket created successfully");
        navigate("/contact-support");
      } else {
        toast.error(data?.data || data?.code || "Failed to create ticket!");
        // setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
      // setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <form
        className=" p-4 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6">Create Ticket</h2>

        {/* Subject Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            value={subject}
            type="text"
            placeholder="Write ticket subject here"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            onChange={(e) => setSubject(e?.target?.value)}
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            rows="4"
            placeholder="Enter your text here..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            onChange={(e) => setDescription(e?.target?.value)}
          ></textarea>
          <p className="mt-2 text-sm text-gray-500">
            Do not enter any confidential information, export-controlled data,
            personal data, or other sensitive data.
          </p>
        </div>

        {/* Add Attachment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Add attachment
          </label>
          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-28 w-[125px] relative">
            <input
              type="file"
              accept="image/*,video/*"
              className={`inset-0 opacity-0 cursor-pointer w-[100%] h-[100%] ${selectedFile ? "hidden" : ""}`}
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <>
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Attachment Preview"
                    className="object-cover w-full h-full rounded-lg pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(selectedFile)}
                    className="object-cover w-full h-full rounded-lg pointer-events-none"
                    // controls
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="absolute top-1 right-1 flex space-x-1">
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full p-1 text-xs"
                    onClick={() => setSelectedFile(null)}
                  >
                    <SvgComponent name={"SmDeleteIcon"} />
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white rounded-full p-1 text-xs"
                    onClick={() =>
                      window.open(URL.createObjectURL(selectedFile), "_blank")
                    }
                  >
                    <SvgComponent name={"panZoom"} />
                  </button>
                </div>
              </>
            ) : (
              <span className="text-[#696CFF] absolute text-[32px]">+</span>
            )}
          </div>
        </div>

        {/* Category and Severity */}
        <div className="flex gap-4 mb-6">
          <div className={`w-1/2 ${isCategoryOpen ? "mb-8" : ""}`}>
            <SingleSelectDropDown
              label={"Category"}
              Options={categoryOptions}
              handleOptionClick={handleCategoryOptionClick}
              isOpen={isCategoryOpen}
              setIsOpen={SetIsCategoryOpen}
              selectedOption={selectedCategoryOption}
              defaultSelected={"Choose Category"}
            />
          </div>
          <div className={`w-1/2 ${isSeverityOpen ? "mb-8" : ""}`}>
            <SingleSelectDropDown
              label={"Severity"}
              Options={severityOptions}
              handleOptionClick={handleSeverityOptionClick}
              isOpen={isSeverityOpen}
              setIsOpen={SetIsSeverityOpen}
              selectedOption={selectedSeverityOption}
              defaultSelected={"Choose Severity"}
              Severity={true}
              style={{ maxHeight: "150px" }}
            />
          </div>
        </div>
        {/* <div className="relative w-1/2 ">
          <InputTag
            value={searchInput}
            type="text"
            placeholder="Search Tickets"
            // customClass="w-[100%] h-[50px] mb-4 px-4 py-2 !pl-9 rounded-[8px] shadow-md"
            onChange={(e) => setSearchInput(e?.target?.value)}
            // disabled={Object.keys(assignedAgent)?.length > 0 ? true : false}
            style={{ paddingLeft: "30px" }}
          />
          <span className="absolute left-3 top-[37%] transform -translate-y-1/2 text-gray-400 cursor-pointer search-icon-wrap">
            <SvgComponent name={"GraySearchIcon"} />
          </span>
        </div> */}
        {/* {userAgents && (
          <div className="w-1/2 max-h-[300px] overflow-y-auto">
            {userAgents?.map((user, index) => (
              <div
                key={user.ID}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 last:mb-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${user?.color}`}
                  >
                    <span
                      className={`text-xl font-semibold ${user?.textColor}`}
                    >
                      {user?.initials?.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{user?.Fullname}</h4>
                    <p className="text-gray-500">{user?.Email}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="assignAgent"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={selectedAgentId === user?.ID}
                  onChange={() => setSelectedAgentId(user?.ID)}
                />
              </div>
            ))}
          </div>
        )} */}
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 text-gray-500 rounded-full border border-gray-300 hover:bg-gray-100"
            type="button"
            onClick={() => navigate("/contact-support")}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
            type="submit"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateTicket;
