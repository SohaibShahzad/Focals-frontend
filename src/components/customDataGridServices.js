import React from "react";

const MAX_WORDS = 10;

const truncateText = (text) => {
  const words = text.split(" ");
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(" ") + "...";
  }
  return text;
};

const CustomDataGridServices = ({ columns, data, options }) => {
  return (
    <div className="overflow-x-auto w-full rounded-md">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-[#333333]">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-2 border-2">
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-[#472305] font-bold" : "bg-orange-400 text-black font-bold"}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="border-2 px-4 py-2"
                >
                  {col.renderCell
                    ? col.renderCell(row)
                    : truncateText(row[col.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomDataGridServices;
