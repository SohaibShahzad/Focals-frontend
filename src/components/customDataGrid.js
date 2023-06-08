import React from "react";

const CustomDataGrid = ({ columns, data, options }) => {
  return (
    <div className="overflow-x-auto w-full rounded-md">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-orange-700">
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
              className={
                index % 2 === 0
                  ? "bg-[#444444] font-bold"
                  : "bg-[#AAAAAA] text-black font-bold"
              }
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="border-2 px-4 py-2"

                  // className={
                  //   colIndex !== 0 ? "border-l-2 px-4 py-2" : "px-4 py-2"
                  // }
                >
                  {col.renderCell ? col.renderCell(row) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomDataGrid;
