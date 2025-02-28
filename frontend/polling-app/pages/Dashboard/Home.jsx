import React, { useEffect, useState } from "react";
import DashboardLayout from "../../src/components/layout/DashboardLayout";
import useUserAuth from "../../src/hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderwithFilter from "../../src/components/layout/HeaderwithFilter";
import axiosInstance from "../../src/utils/axiosInstance";
import { API_PATHS } from "../../src/utils/apiPaths";
import PollCard from "../../src/components/PollCards/PollCard";

import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState("");

  const PAGE_SIZE = 5;

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) => {
          return overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls];
        });
        setStats(response.data?.stats || []);
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls=()=>{
    setPage((prevPage)=>prevPage+1)
  }

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
    return () => {};
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="Dashboard" stats={stats||[]} showStats>
      <div className="my-5 mx-auto">
        <HeaderwithFilter
          title="Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

{/* Infinite scrolling */}

<InfiniteScroll dataLength={allPolls.length}
next={loadMorePolls}
hasMore={hasMore}
loader={<h4 className="info-text">Loading...</h4>}
endMessage={<p className="info-text">No more polls to display.</p>}>

      {allPolls.map((poll) => (
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
        </InfiniteScroll>
        </div>
    </DashboardLayout>
  );
};

export default Home;
