import React from 'react';


const MAX_WORDS = 10;

const truncateText = (text) => {
  const words = text.split(' ');
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(' ') + '...';
  }
  return text;
};


const CustomDataGrid = ({ columns, data, options }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-2 border border-gray-300">
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border border-gray-300">
                  {col.renderCell ? col.renderCell(row) :row[col.field]}
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
