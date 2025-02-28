import React from "react";

const EmptyCard = ({ onClick, btnText, message, imgSrc }) => {
  return <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg">
    <img src={imgSrc} alt="No notes" className="w-36 md:w-48 border-none rounded-full" />
    
    <p className="w-2/3 text-xs md:text-[14px] text-slate-900 text-center leading-6 mt-7">
    {message}
    </p>

    {btnText && (
        <button className="btn-small px-6 py-2 mt-7" onClick={onClick}>
            {btnText}
        </button>
    )}
    </div>;
};

export default EmptyCard;
