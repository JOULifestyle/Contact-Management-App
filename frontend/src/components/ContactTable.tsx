import React, { useState } from "react";
import type { Contact } from "../api";
import toast from "react-hot-toast";
import * as api from "../api";
import { FaWhatsapp } from "react-icons/fa";

interface Props {
  items: Contact[];
  onRefresh: () => Promise<void>;
  onEdit: (contact: Contact) => void;
  highlight?: string;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
}

export default function ContactTable({
  items,
  onRefresh,
  onEdit,
  highlight = "",
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await api.deleteContact(id);
      toast.success("Contact deleted!");
      await onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }

  function highlightText(text: string) {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  function renderAvatar(contact: Contact) {
    if (contact.photoUrl) {
      return (
        <img
          src={contact.photoUrl}
          alt={contact.name}
          className="w-10 h-10 rounded-full"
        />
      );
    }
    const initials = contact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-zinc-700 flex items-center justify-center text-white font-bold">
        {initials}
      </div>
    );
  }

  // normalize phone for WhatsApp (assume Nigeria default country code 234)
  function normalizePhone(phone: string) {
    let digits = phone.replace(/\D/g, ""); // strip non-digits
    if (digits.startsWith("0")) {
      digits = "234" + digits.slice(1); // convert local to intl
    }
    return digits;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border min-w-full border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <thead>
          <tr className="bg-gray-200 dark:bg-zinc-800">
            <th className="p-2 flex justify-start md:justify-center text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={onToggleSelectAll}
              />
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Avatar
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Name
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Email
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Phone
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Category
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Birthday
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Company
            </th>
            <th className="hidden md:table-cell p-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                className="text-center p-4 text-gray-700 dark:text-gray-300"
              >
                No contacts found
              </td>
            </tr>
          ) : (
            items.map((c) => (
              <React.Fragment key={c.id}>
                {/* Desktop & Mobile row */}
                <tr className="border-t border-gray-200 dark:border-zinc-700 md:table-row flex md:flex-none flex-col md:flex-row md:items-center hover:bg-gray-50 dark:hover:bg-zinc-800">
                  {/* Checkbox, Avatar, Name */}
                  <td className="p-2 text-center md:table-cell flex items-center gap-2 md:gap-0 text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => onToggleSelect(c.id)}
                    />
                    <div className="md:hidden">{renderAvatar(c)}</div>
                    <span className="md:hidden">{highlightText(c.name)}</span>
                  </td>

                  {/* Desktop-only cells */}
                  <td className="hidden md:table-cell p-2 text-gray-700 dark:text-gray-300">
                    {renderAvatar(c)}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {highlightText(c.name)}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {c.email ? (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {highlightText(c.email)}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {c.phone ? (
                      <div className="flex gap-2">
                        <a
                          href={`tel:${c.phone}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {highlightText(c.phone)}
                        </a>
                        <a
                          href={`https://wa.me/${normalizePhone(c.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          <FaWhatsapp size={20} />
                        </a>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {c.category || "-"}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {c.birthday || "-"}
                  </td>
                  <td className="hidden md:table-cell p-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {c.company || "-"}
                  </td>

                  {/* Actions */}
                  <td className="hidden md:gap-2 md:table-cell p-2 whitespace-nowrap">
                    <button
                      className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => onEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>

                  {/* Mobile Details button */}
                  <td className="md:hidden p-2 flex justify-end gap-2 items-center">
                    <button
                      className="btn bg-blue-500 hover:bg-blue-600 text-xs text-white"
                      onClick={() => toggleExpanded(c.id)}
                    >
                      {expandedIds.has(c.id) ? "Hide" : "Details"}
                    </button>
                    <button
                      className="btn bg-yellow-500 hover:bg-yellow-600 text-xs text-white"
                      onClick={() => onEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn bg-red-600 hover:bg-red-700 text-xs text-white"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Mobile expanded details */}
                {expandedIds.has(c.id) && (
                  <tr className="md:hidden">
                    <td
                      colSpan={10}
                      className="p-4 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-zinc-700"
                    >
                      <div className="space-y-2">
                        <div>
                          <strong>Email:</strong>{" "}
                          {c.email ? (
                            <a
                              href={`mailto:${c.email}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {highlightText(c.email)}
                            </a>
                          ) : (
                            "-"
                          )}
                        </div>
                        <div>
                          <strong>Phone:</strong>{" "}
                          {c.phone ? (
                            <span className="flex gap-2">
                              <a
                                href={`tel:${c.phone}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {highlightText(c.phone)}
                              </a>
                              <a
                                href={`https://wa.me/${normalizePhone(c.phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                              >
                                <FaWhatsapp size={20} />
                              </a>
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>
                        <div>
                          <strong>Category:</strong> {c.category || "-"}
                        </div>
                        <div>
                          <strong>Birthday:</strong> {c.birthday || "-"}
                        </div>
                        <div>
                          <strong>Company:</strong> {c.company || "-"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
