import { useState, useEffect, useRef } from "react";
import * as api from "../api";
import type { Contact } from "../api";
import ContactTable from "../components/ContactTable";
import ContactForm from "../components/ContactForm";
import Header from "../components/Header";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const vcardInputRef = useRef<HTMLInputElement | null>(null);

  // Collapsible form state
  const [formVisible, setFormVisible] = useState(false);

  // Auto-expand form when editing
  useEffect(() => {
    if (editingContact) setFormVisible(true);
  }, [editingContact]);

  // --- Birthday helpers ---
  function isTodayBirthday(birthday: string | null) {
    if (!birthday) return false;
    const today = new Date();
    const bday = new Date(birthday);
    return (
      bday.getDate() === today.getDate() &&
      bday.getMonth() === today.getMonth()
    );
  }

  const todayBirthdays = contacts.filter((c) => isTodayBirthday(c.birthday ?? null));


  // Show toast on birthdays
  useEffect(() => {
    if (todayBirthdays.length > 0) {
      todayBirthdays.forEach((c) =>
        toast.info(`🎂 Today is ${c.name}'s birthday!`, {
          position: "top-right",
        })
      );
    }
  }, [contacts]);

  async function handleBulkTag(tag: string) {
    try {
      await Promise.all(
        selectedIds.map((id) => api.updateContact(id, { category: tag }))
      );
      toast.success(`Tagged ${selectedIds.length} as ${tag}`);
      setSelectedIds([]);
      await loadContacts();
    } catch {
      toast.error("Bulk tag failed");
    }
  }

  async function handleBulkExportCSV() {
    try {
      const selectedContacts = contacts.filter((c) =>
        selectedIds.includes(c.id)
      );
      if (selectedContacts.length === 0) return;

      const header = [
        "Name",
        "Email",
        "Phone",
        "Category",
        "Birthday",
        "Company",
        "PhotoUrl",
      ];
      const rows = selectedContacts.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.category || "",
        c.birthday || "",
        c.company || "",
        c.photoUrl || "",
      ]);

      const csvContent =
        [header, ...rows]
          .map((r) => r.map((v) => `"${v}"`).join(","))
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Exported to CSV!");
    } catch {
      toast.error("Export failed");
    }
  }

  async function handleBulkExportVCard() {
    try {
      const selectedContacts = contacts.filter((c) =>
        selectedIds.includes(c.id)
      );
      if (selectedContacts.length === 0) return;

      const vCards = selectedContacts
        .map(
          (c) => `BEGIN:VCARD
VERSION:3.0
FN:${c.name}
EMAIL:${c.email || ""}
TEL:${c.phone || ""}
ORG:${c.company || ""}
BDAY:${c.birthday || ""}
CATEGORIES:${c.category || ""}
PHOTO;VALUE=URI:${c.photoUrl || ""}
END:VCARD`
        )
        .join("\r\n");

      const blob = new Blob([vCards], { type: "text/vcard;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts_export.vcf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Exported to vCard!");
    } catch {
      toast.error("vCard export failed");
    }
  }

  async function handleBulkDelete() {
    if (!window.confirm(`Delete ${selectedIds.length} contacts?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => api.deleteContact(id)));
      toast.success("Contacts deleted!");
      setSelectedIds([]);
      await loadContacts();
    } catch {
      toast.error("Bulk delete failed");
    }
  }

  // Load contacts
  async function loadContacts() {
    try {
      setLoading(true);
      const data = await api.getContacts();
      setContacts(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.importContacts(formData);
      toast.success("Contacts imported!");
      await loadContacts();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleImportVCard(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.importContactsVCard(formData);
      toast.success("Contacts imported from vCard!");
      await loadContacts();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      if (vcardInputRef.current) vcardInputRef.current.value = "";
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter contacts
  useEffect(() => {
    if (!debouncedQuery) setFilteredContacts(contacts);
    else {
      const lower = debouncedQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            c.email.toLowerCase().includes(lower) ||
            c.phone.toLowerCase().includes(lower)
        )
      );
    }
  }, [contacts, debouncedQuery]);

  // Sort filtered
  const sortedContacts = [...filteredContacts].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id));
    }
  }

  return (
    <>
      <Header onSearch={(q) => setSearchQuery(q)} />
      <div className="container mx-auto p-4 pt-10">
        {/* 🎂 Birthday section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">🎂 Today's Birthdays</h2>
          {todayBirthdays.length === 0 ? (
            <p className="text-gray-600">No birthdays today</p>
          ) : (
            todayBirthdays.map((c) => (
              <div
                key={c.id}
                className="bg-pink-100 border border-pink-300 p-3 rounded my-2 flex items-center gap-3"
              >
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6">My Contacts</h1>

        {/* Toggle Button + Import Buttons */}
        <div className="mb-4 flex gap-2">
          <button className="btn" onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? "Undo" : "Add New Contact"}
          </button>

          <button className="btn" onClick={() => fileInputRef.current?.click()}>
            Import CSV
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />

          <button
            className="btn"
            onClick={() => vcardInputRef.current?.click()}
          >
            Import vCard
          </button>
          <input
            type="file"
            accept=".vcf"
            ref={vcardInputRef}
            className="hidden"
            onChange={handleImportVCard}
          />
        </div>

        {/* Collapsible Form */}
        {formVisible && (
          <ContactForm
            editing={editingContact}
            onSaved={() => {
              setEditingContact(null);
              setFormVisible(false);
              loadContacts();
            }}
          />
        )}

        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-gray-100 p-2 mb-4 rounded">
            <div className="mb-2">
              <span className="font-medium">{selectedIds.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="btn bg-red-600 hover:bg-red-700"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </button>

              <select
                className="border rounded px-3 py-2 text-sm sm:text-base bg-white shadow-sm"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkTag(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="">Tag as...</option>
                <option value="Family">Family</option>
                <option value="Work">Work</option>
                <option value="VIP">VIP</option>
              </select>

              <button
                className="btn bg-blue-600 hover:bg-blue-700"
                onClick={handleBulkExportCSV}
              >
                Export to CSV
              </button>
              <button
                className="btn bg-green-600 hover:bg-green-700"
                onClick={handleBulkExportVCard}
              >
                Export to vCard
              </button>
            </div>
          </div>
        )}

        {/* Sort button */}
        <div className="flex justify-end mb-2">
          <button
            className="btn"
            onClick={() =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
          >
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>
        </div>

        {loading && <p>Loading contacts...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <ContactTable
            items={sortedContacts}
            onRefresh={loadContacts}
            onEdit={setEditingContact}
            highlight={debouncedQuery}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />
        )}
      </div>
    </>
  );
}
