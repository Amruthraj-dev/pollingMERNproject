import React, { useEffect, useState } from "react";
import DashboardLayout from "../../src/components/layout/DashboardLayout";
import useUserAuth from "../../src/hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../src/utils/axiosInstance";
import { API_PATHS } from "../../src/utils/apiPaths";
import PollCard from "../../src/components/PollCards/PollCard";

import EmptyCard from "../../src/components/cards/EmptyCard";
import CREATE_ICON from "../../src/assets/images/my-poll-icon.png"

const VotedPolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [VotedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAllPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) => {
          return [...prevPolls, ...response.data.polls];
        });

          }
    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchAllPolls()
    return ()=>{}
  },[])


  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Voted Polls</h2>

        {VotedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="You have not voted on any polls yet! Start exploring and share your opinion by voting on polls now!"
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}

        

       
          {VotedPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters.length || 0}
              responses={poll.responses || []}
              creatorProfileImg={poll.creator.profileImageUrl || null}
              creatorName={poll.creator.fullName}
              creatorUsername={poll.creator.username}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || false}
            />
          ))}
      
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
