import React from "react";
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from "react-icons/md";

const OptionInputTile = ({ isSelected, label, onSelect }) => {
  const getColors = () => {
    if (isSelected) return "text-white bg-cyan-500 border-sky-400";
    return "text-black bg-slate-200/80 border-slate-200";
  };
  return (
    <button
      className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${getColors()}`}
      onClick={onSelect}
    >
      {isSelected ? (
        <MdRadioButtonChecked className="text-lg text-white" />
      ) : (
        <MdRadioButtonUnchecked className="text-lg text-slate-100" />
      )}
    </button>
  );
};

export default OptionInputTile;
