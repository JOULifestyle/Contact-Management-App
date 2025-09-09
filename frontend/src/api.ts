export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

  //  LOADING HANDLER 
let loadingHandler: ((loading: boolean) => void) | null = null;

export function setLoadingHandler(handler: (loading: boolean) => void) {
  loadingHandler = handler;
}

function startLoading() {
  if (loadingHandler) loadingHandler(true);
}

function stopLoading() {
  if (loadingHandler) loadingHandler(false);
}

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  startLoading();
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>) || {},
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Only set Content-Type if body is JSON (not FormData)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    //  If token expired/invalid - logout + redirect
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return res.json();
  } finally {
    stopLoading();
  }
}



//  AUTH 
export async function signup(email: string, password: string) {
  return request<{ token: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

//  CONTACTS 
export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  userId?: number;
  category?: string;
  birthday?: string;
  company?: string;
  photoUrl?: string;
};

export async function getContacts() {
  return request<Contact[]>("/contacts");
}

export async function createContact(contact: Omit<Contact, "id">) {
  return request<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

export async function updateContact(id: number, contact: Partial<Contact>) {
  return request<Contact>(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(contact),
  });
}

export async function deleteContact(id: number) {
  return request<{ success: boolean }>(`/contacts/${id}`, {
    method: "DELETE",
  });
}

//  CONTACTS (with file upload) 
export async function createContactFormData(formData: FormData) {
  return request<Contact>("/contacts", {
    method: "POST",
    body: formData,
  });
}

export async function updateContactFormData(id: number, formData: FormData) {
  return request<Contact>(`/contacts/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function uploadAvatar(file: File) {
  startLoading();
  try {
  const formData = new FormData();
  formData.append("avatar", file);

  const token = getToken();
  const res = await fetch(`${API_BASE}/contacts/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }

  return res.json() as Promise<{ url: string }>;
} finally {
  stopLoading();
}
}

//  IMPORT 
export async function importContacts(formData: FormData) {
  startLoading();
  try {
  const token = getToken();
  const res = await fetch(`${API_BASE}/import/csv`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
} finally {
    stopLoading();
  }
}

export async function importContactsVCard(formData: FormData) {
  startLoading();
  try {
  const token = getToken();
  const res = await fetch(`${API_BASE}/import/vcard`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
} finally {
    stopLoading();
  }
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to send reset email");
  return res.json();
}

export async function bulkTagContacts(ids: number[], category: string) {
  return request<{ updated: number }>("/contacts/bulk-tag", {
    method: "PUT",
    body: JSON.stringify({ ids, category }),
  });
}
