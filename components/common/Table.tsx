
import React from 'react';

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    emptyMessage: string;
    itemCount: number;
}

const Table: React.FC<TableProps> = ({ headers, children, emptyMessage, itemCount }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {itemCount > 0 ? children : (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
