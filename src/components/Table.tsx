"use client";

import { ReactNode } from 'react';

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onView: (row: T) => void;
};

function DataTable<T>({ data, columns }: Props<T>) {
  return (
    <div className="overflow-hidden bg-white rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 font-medium text-left text-[var(--primary-color)]">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-200 hover:bg-opacity-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-[var(--primary-color)]">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
          
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
