import React, { useContext, useState } from "react";
import DashboardLayout from "../../src/components/layout/DashboardLayout";
import useUserAuth from "../../src/hooks/useUserAuth";
import { UserContext } from "../../src/context/UserContext";
import { POLL_TYPE } from "../../src/utils/data";
import OptionInput from "../../src/components/input/Optioninput";
import OptionImageSelector from "../../src/components/input/OptionImageSelector";
import axiosInstance from "../../src/utils/axiosInstance";
import { API_PATHS } from "../../src/utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../src/utils/uploadImage";

const CreatePoll = () => {
  useUserAuth();

  const { user,onPollCreateOrDelete } = useContext(UserContext);

  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOptions: [],

    error: "",
  });

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Clear Data
  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imageOptions: [],
      error: "",
    });
  };

  //Upload Images and Get Image Urls
  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadsRes = await uploadImage(imageOption.file);
        return imgUploadsRes.imageUrl || "";
      } catch (err) {
        toast.error(`Error uploading image: ${imageOption.file.name} ${err.message}` );
        return "";
      }
    });

    const optionArr = await Promise.all(optionPromises);
    return optionArr;
  };

  const getoptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options;

      case "image-based":
        const options = await updateImageAndGetLink(pollData.imageOptions);
        return options;

      default:
        return [];
    }
  };

  //Create a poll
  const handleCreatePoll = async () => {
    const { question, type, options, imageOptions, error } = pollData;

    if (!question || !type) {
      console.log("CREATE:", { question, type, options, error });
      handleValueChange("error", "Question & Type are required");
      return;
    }

    if (type === "single-choice" && options.length < 2) {
      handleValueChange("error:", "Enter atleast two options");
      return;
    }
    if (type === "image-based" && imageOptions.length < 2) {
      handleValueChange("error", "Enter atleast two options");
      return;
    }

    handleValueChange("error:", "");
    console.log("NO_ERR", { pollData });

    const optionData = await getoptions();

    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionData,
        creatorId: user._id,
      });

      if (response) {
        toast.success("Poll Created Successfully!");
        onPollCreateOrDelete()
        clearData();
      }
    } catch (e) {
      if (e.response && e.response.data.message) {
        toast.error(e.response.data.message);
        handleValueChange("error", e.response.data.message);
      } else {
        handleValueChange("error", "Something went wrong. Please try again.");

      }
    }
  };

  return (
    <DashboardLayout activeMenu="Create Poll">
      <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
        <h2 className="text-lg text-black font-medium">Create Poll</h2>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">QUESTION</label>

          <textarea
            placeholder="What's in your mind"
            rows={4}
            value={pollData.question}
            onChange={({ target }) =>
              handleValueChange("question", target.value)
            }
            className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2"
          />
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">
            POLL TYPE
          </label>

          <div className="flex gap-4 flex-wrap mt-3">
            {POLL_TYPE.map((item) => (
              <div
                key={item.value}
                className={`option-chip ${
                  pollData.type === item.value
                    ? "text-white bg-cyan-500 border-cyan-500"
                    : "border-sky-100"
                }`}
                onClick={() => {
                  handleValueChange("type", item.value);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              OPTIONS
            </label>

            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => {
                  handleValueChange("options", value);
                }}
              />
            </div>
          </div>
        )}
        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              IMAGE OPTIONS
            </label>

            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value) => {
                  handleValueChange("imageOptions", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {pollData.error}
          </p>
        )}

        <button className="btn-primary py-2 mt-6" onClick={handleCreatePoll}>
          CREATE
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
