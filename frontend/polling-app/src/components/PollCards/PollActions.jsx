import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const PollActions = ({
  pollID,
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-4">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 p-3 py-1 rounded-md">
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}

      {/* closing poll */}
      {isMyPoll && !pollClosed && (
        <button
          className="btn-small text-cyan-600 bg-cyan-500/20 hover:bg-cyan-500 hover:text-white hover:border-orange-100 "
          onClick={onClosePoll}
          disabled={loading}
        >
          Close
        </button>
      )}

      {/* deleting poll */}
      {isMyPoll && (
        <button
          className="btn-small text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white hover:border-orange-100 "
          onClick={onDelete}
          disabled={loading}
        >
          Delete
        </button>
      )}

      <button className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className="text-cyan-500" />
        ) : (
          <FaRegBookmark />
        )}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button
          className="btn-small ml-auto"
          onClick={handleVoteClick}
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
