const ComparisonRow = ({ labelIcon, label, buzzValue, otherValue }) => {
  return (
    <div className="grid grid-cols-3 items-center py-3 px-4 border-b border-gray-100 text-sm text-center sm:text-left">
      <div className="flex items-center gap-2 text-gray-700">
        {labelIcon}
        <span>{label}</span>
      </div>
      <div className="text-green-600 font-medium">{buzzValue}</div>
      <div className="text-gray-500">{otherValue}</div>
    </div>
  );
};

export default ComparisonRow;
