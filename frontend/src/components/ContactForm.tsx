import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { Contact } from "../api";
import toast from "react-hot-toast";

export default function ContactForm({
  onSaved,
  editing,
}: {
  onSaved: (c: Contact) => void;
  editing: Contact | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [birthday, setBirthday] = useState("");
  const [company, setCompany] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmail(editing.email);
      setPhone(editing.phone);
      setCategory(editing.category || "");
      setBirthday(editing.birthday || "");
      setCompany(editing.company || "");
      setPhoto(null);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCategory("");
      setBirthday("");
      setCompany("");
      setPhoto(null);
    }
  }, [editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = editing?.photoUrl || "";

      // ✅ Step 1: upload file if selected
      if (photo) {
        const { url } = await api.uploadAvatar(photo);
        photoUrl = url;
      }

      // ✅ Step 2: save contact with JSON body
      let result: Contact;
      if (editing) {
        result = await api.updateContact(editing.id, {
          name,
          email,
          phone,
          category,
          birthday,
          company,
          photoUrl,
        });
        toast.success("Contact updated!");
      } else {
        result = await api.createContact({
          name,
          email,
          phone,
          category,
          birthday,
          company,
          photoUrl,
        });
        toast.success("Contact added!");
      }

      onSaved(result);

      // ✅ Reset form after save
      setName("");
      setEmail("");
      setPhone("");
      setCategory("");
      setBirthday("");
      setCompany("");
      setPhoto(null);
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 mb-4">
      <div>
        <label className="label">Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Phone</label>
        <input
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
  <label className="label">Category</label>
  <select
    className="w-full border rounded px-3 py-2 text-sm sm:text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">Select category</option>
    <option value="Family">Family</option>
    <option value="Work">Work</option>
    <option value="VIP">VIP</option>
  </select>
</div>

      <div>
        <label className="label">Birthday</label>
        <input
          type="date"
          className="input"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Company</label>
        <input
          className="input"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          className="input"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <button disabled={loading} className="btn" type="submit">
          {loading ? "Saving…" : editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => onSaved(editing)}
            className="btn bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
