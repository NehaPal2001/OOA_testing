import React from "react";

const CodingInput = ({ answer, onChange }) => {
  return (
    <div className="space-y-2">
      <textarea
        className="w-full p-3 border rounded-md min-h-[300px] resize-y font-mono bg-gray-50"
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="// Write your code here..."
        spellCheck={false}
      />
      <p className="text-sm text-gray-500">
        Lines: {answer.split("\n").length}
      </p>
    </div>
  );
};

export default CodingInput;
