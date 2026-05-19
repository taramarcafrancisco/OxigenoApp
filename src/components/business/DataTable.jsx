import EmptyState from "./EmptyState";
import { toDisplayText } from "@/utils/formatters";

export default function DataTable({ columns, rows, emptyTitle }) {
  if (!rows?.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-bold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.render ? column.render(row) : toDisplayText(row?.[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
