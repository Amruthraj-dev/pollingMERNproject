import React from "react";
import OptionInputTile from "../options/OptionInputTile";
import Rating from "../options/Rating";
import ImageOptionInputTile from "../options/InputTile";

const PollContent = ({
  type,
  options,
  selectedOptionIndex,
  onOptionSelect,
  rating,
  onRatingChange,
  userResponse,
  onResponseChange,
}) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
      return (
        <>
          {options.map((option, index) => {
            <OptionInputTile
              key={option._id}
              isSelected={selectedOptionIndex == index}
              label={option.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />;
          })}
        </>
      );
    case "rating":
      return <Rating value={rating} onChange={onRatingChange} />;

    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <ImageOptionInputTile
              key={option._id}
              isSelected={selectedOptionIndex === index}
              imgUrl={option.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </div>
      );

    case "open-ended":
      return (
        <div className="-mt-3">
          <textarea
            placeholder="Your Response"
            className="w-full text-[13px] text-black outline-none bg-slate-200/80 rounded-md mt-2"
            rows={4}
            value={userResponse}
            onChange={({ target }) => onResponseChange(target.value)}
          />
        </div>
      );
  }
};

export default PollContent;
