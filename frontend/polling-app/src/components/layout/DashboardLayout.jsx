import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import UserDetailsCard from "../cards/UserDetailsCard";
import { UserContext } from "../../context/UserContext";
import TrendingPolls from "./TrendingPolls";

const DashboardLayout = ({ children, activeMenu, showStats, stats }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex h-full overflow-hidden">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5 overflow-y-auto">{children}</div>
          <div className="hidden md:block mr-5">
            <UserDetailsCard
              profileImageUrl={user && user.profileImageUrl}
              fullname={user && user.fullName}
              username={user && user.username}
              totalPollsVotes={user && user.totalPollsVotes}
              totalPollsCreated={user && user.totalPollsCreated}
              totalPollsBookmarked={user && user.totalPollsBookmarked}
            />

            {showStats && stats?.length > 0 && <TrendingPolls stats={stats} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
