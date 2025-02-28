import React, { useCallback, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getPollBookMarked } from "../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import PollResultContent from "./PollResultContent";
const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isMyPoll,
  isPollClosed,
  createdAt,
}) => {
  const { user, onUserVoted, toggleBookmarkId,onPollCreateOrDelete } = useContext(UserContext);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");

  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookMarked = getPollBookMarked(
    pollId,
    user?.bookmarkedPolls || []
  );

  const [pollBookMarked, setPollBookMarked] = useState(isPollBookMarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  //Handles user input based on the poll type
  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  //Generates post data based on the poll type
  const getPostData = useCallback(() => {
    if (type == "open-ended") {
      return { responseText: userResponse, voterId: user._id };
    }
    if (type == "rating") {
      return { optionIndex: rating - 1, voterId: user._id };
    }
    return { optionIndex: selectedOptionIndex, voterId: user._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  //Get Poll Details by Id
  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );
      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Error submitting vote");
    }
  };

  //Handles the submission of votes
  const handleVoteSubmit = async () => {
    try {
      console.log(pollId);
      const response = await axiosInstance.post(
        API_PATHS.POLLS.VOTE(pollId),
        getPostData()
      );

      getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success("Vote submitted successfully!");
    } catch (err) {
      console.error(err.response?.data?.message || "Error submitting vote");
    }
  };

  //Toggles the bookmark status of a poll
  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );

      toggleBookmarkId(pollId);
      setPollBookMarked((prev) => !prev);
      toast.success(response.data.message);
    } catch (err) {
      console.error(err.response?.data?.message || "Error bookmarking poll");
    }
  };

  //Close Poll
  const closePoll=async()=>{
    try{
      const response=await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId))

      if(response.data){
        setPollClosed(true)
        toast.success(response.data?.message || "Poll Closed Successfully!")
      }
    }
    catch(err){
      toast.error("Something went wrong. Please try again.")
      console.log("Something went wrong. Please try again.",err)
    }
  }
  const deletePoll=async()=>{
    try{
      const response=await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId))

      if(response.data){
        setPollDeleted(true)
        onPollCreateOrDelete()
        toast.success(response.data?.message || "Poll Deleted Successfully!")
      }
    }
    catch(err){
      toast.error("Something went wrong. Please try again.")
      console.log("Something went wrong. Please try again.",err)
    }
  }




  return (
    !pollDeleted && (
      <div className="bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto">
        <div className="flex items-start justify-between">
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullname={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />

          <PollActions
            pollID={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookMarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={closePoll}
            onDelete={deletePoll}
          />
        </div>

        <div className="ml-14 mt-3">
          <p className="text-[15px] text-black leading-8">{question}</p>
          <div className="mt-4">
            {isVoteComplete || isPollClosed ? (
             <PollResultContent
             type={type}
             options={pollResult.options|| []}
             voters={pollResult.voters}
             responses={pollResult.responses||[]}
             />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
