"use client"
import React from "react"
import { RiExpandUpDownLine } from "react-icons/ri"
import { DataTableProps } from "@/data/sessions"


/**
 * A fully reusable, flexible data table component
 */
export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  sortField,
  sortOrder,
  onSort,
  onRowClick,
  emptyMessage = "No records found",
  maxHeight = "650px",
}: DataTableProps<T>) {
  return (
    <div className={`overflow-y-scroll`} style={{ maxHeight }}>
      <table className="w-full text-left border-collapse">
        {/* ---- TABLE HEADER ---- */}
        <thead className="bg-neutral-light">
          <tr className="border border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`p-4 ${col.className || ""}`}
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(String(col.key))}
                    className="flex items-center gap-1 hover:text-brand-700 transition-colors"
                  >
                    <span>{col.header}</span>
                    <RiExpandUpDownLine
                      className={`transition-transform ${
                        sortField === col.key
                          ? sortOrder === "asc"
                            ? "text-brand-700 rotate-180"
                            : "text-brand-700"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* ---- TABLE BODY ---- */}
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-accent-50 cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="p-4 text-gray-800">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className=""
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}



{/* <div className="h-[650px] overflow-y-scroll">
    <table className="w-full text-left border-collapse">
        <thead className="bg-neutral-light">
            <tr className="border border-gray-200">
                <th className="p-4">
                    <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-brand-700 transition-colors"
                    >
                        <span>Customer Name</span>
                        <RiExpandUpDownLine
                        className={`transition-transform ${
                            sortField === "name"
                            ? sortOrder === "asc"
                                ? "text-brand-700 rotate-180"
                                : "text-brand-700"
                            : "text-gray-400"
                        }`}
                        />
                    </button>
                </th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">DOB</th>
                <th className="p-4">
                    <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 hover:text-brand-700 transition-colors"
                    >
                        <span>Status</span>
                        <RiExpandUpDownLine
                        className={`transition-transform ${
                            sortField === "status"
                            ? sortOrder === "asc"
                                ? "text-brand-700 rotate-180"
                                : "text-brand-700"
                            : "text-gray-400"
                        }`}
                        />
                    </button>
                </th>
                <th className="p-4">
                    <button
                        onClick={() => handleSort("total")}
                        className="flex items-center gap-1 hover:text-brand-700 transition-colors"
                    >
                        <span>Total Spent</span>
                        <RiExpandUpDownLine
                        className={`transition-transform ${
                            sortField === "total"
                            ? sortOrder === "asc"
                                ? "text-brand-700 rotate-180"
                                : "text-brand-700"
                            : "text-gray-400"
                        }`}
                        />
                    </button>
                </th>
                <th className="text-right p-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            {paginatedCustomers.map((c) => {
                const fullName = `${c.firstName} ${c.lastName}`
                const sessions = mockSessions.filter(s => s.customer === fullName)
                const total = sessions.filter(s => s.status !== "cancel").reduce((sum, s) => sum + s.totalPrice, 0)
                return(
                    <tr key={c.id} 
                        className="border-b border-gray-200 hover:bg-accent-50"
                        onClick={() => (console.log(c))}>
                        <td className="p-4 text-brand-primary font-semibold">{fullName}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4">{c.phone}</td>
                        <td className="p-4">{c.dateOfBirth}</td>
                        <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize text-brand-primary
                            ${c.status == "active" ? "bg-sucess" : 'bg-error'}
                            `}
                            >
                                {c.status}
                            </span>
                        </td>
                        <td className="p-4">
                            ${total}
                        </td>
                        <td className="p-4 text-right space-x-3">
                            <button
                                className="
                                text-gray-400 hover:text-brand-600 
                                transition-colors duration-200
                                "
                                title="View"
                            >
                                <MdOutlineRemoveRedEye size={20} />
                            </button>

                            <button
                                className="
                                text-gray-400 hover:text-blue-500 
                                transition-colors duration-200
                                "
                                title="Edit"
                            >
                                <MdOutlineModeEdit size={20} />
                            </button>
                            <button
                                className="
                                text-gray-400 hover:text-red-500 
                                transition-colors duration-200
                                "
                                title="Delete"
                            >
                                <MdOutlineDeleteForever size={20} />
                            </button>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
</div> */}