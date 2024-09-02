import React, { useState, useRef, useEffect } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import { toast } from "react-toastify";
import { t } from "i18next"; // Assuming you're using i18next for localization

const AgentUpsert = ({
  setOpenModal,
  setAgentId,
  agentId,
  fetchTags,
  isLoading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fileError, setFileError] = useState(false);

  const onClose = () => {
    setOpenModal(false);
    setAgentId && setAgentId(null);
  };

  const fetchSingleAgent = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent?id=${agentId}`,
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
      if (data?.code === 200 || data?.code === 1000) {
        setFormData((prev) => ({
          ...prev,
          name: data?.data?.full_name,
          email: data?.data?.email,
        }));
      }
    } catch (error) {
      console.error(t("Error fetching media"), error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchSingleAgent();
    }
  }, [agentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      (formData?.password || formData?.confirmPassword) &&
      formData?.password !== formData?.confirmPassword
    ) {
      setFileError(t("Password & confirm password should be same!"));
      setIsLoading(false);
      return;
    }
    const REGEX_EMAIL =
      /^[a-zA-Z0-9]+[a-zA-Z0-9_.+-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/;

    if (formData?.email && !REGEX_EMAIL.test(formData.email)) {
      setFileError(
        "Invalid email format! Please use the format: username@example.com"
      );
      setIsLoading(false);
      return;
    }
    try {
      let url;
      let method;
      const body = {
        fullname: formData?.name,
        email: formData?.email,
        role: "AGENT",
      };
      if (agentId) {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent/update`;
        method = "PUT";
        body.id = agentId;
        if (formData?.password) {
          body.password = formData?.password;
        }
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/agent/signup`;
        method = "POST";
        body.password = formData?.password;
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await response.json();
      if (data?.code === 1000 || data?.code === 200) {
        toast.success(
          t(`Agent ${agentId ? "updated" : "created"} successfully!`)
        );
        fetchTags();
        onClose();
        setIsLoading(false);
      } else if (data?.code === 2036) {
        toast.error(t("Agent email already exists!"));
        setIsLoading(false);
      } else {
        toast.error(t(`Failed to ${agentId ? "update" : "create"} agent!`));
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setFileError(false);
    }, 7000);
  }, [fileError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        <button
          className="absolute top-4 right-4 w-[30px] h-[30px] bg-[#F0F3FF] flex items-center justify-center rounded-[23px]"
          onClick={onClose}
        >
          <SvgComponent name={"crossIcon"} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {t(agentId ? "Edit Agent" : "Create Agent")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-[20px] ">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={t("Enter Name")}
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={t("Enter Email")}
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Password")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={t("Enter Password")}
                required={agentId ? false : true}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("Confirm Password")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="p-2 border-2 activeInput rounded-[8px] mb-4 w-full"
                placeholder={t("Confirm Password")}
                required={agentId ? false : true}
              />
            </div>
          </div>
          <div className="flex justify-end">
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
              {isLoading ? (
                <>
                  <i className="fa fa-circle-o-notch fa-spin mr-1"></i>
                  {t("Processing")}
                </>
              ) : agentId ? (
                t("Edit")
              ) : (
                t("Create")
              )}
            </button>
          </div>
        </form>
        {fileError && (
          <div className="error-message text-red-500 mt-4">{t(fileError)}</div>
        )}
      </div>
    </div>
  );
};

export default AgentUpsert;
