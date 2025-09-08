# 📇 Contact Management App

A modern, full-stack **Contact Management System** built with **React + TypeScript + Tailwind** (frontend) and **Node.js + Prisma + PostgreSQL** (backend).  
The app provides a secure, scalable, and user-friendly solution to manage contacts with advanced features like **bulk actions, import/export, reminders, and more**.

---

## 🖼️ Preview

![Contact App Screenshot](./docs\Contact_mockup.png)  
---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication (signup, login, logout).
- Token expiration handling → auto-redirects to login.
- Protected routes for logged-in users.
- Validation on backend (email, phone numbers, unique contacts).
- Forgot/Reset password flow via Gmail SMTP (App Passwords).

---

### 🗂 Phase 1 – Organization & Usability
- **Tags/Categories** → Assign labels like *Family*, *Work*, *VIP*.
- **Sorting** → Sort contacts by name (A–Z / Z–A).
- **Profile pictures / avatars** → Upload or auto-generate initials-based avatars.
- **Custom fields** → Birthday, company.
- **Responsive design** → Optimized for mobile, tablet, and desktop.

---

### 📦 Phase 2 – Bulk Operations & Data Management
- **Bulk actions** → Delete, export, or tag multiple contacts at once.
- **CSV / Vcard export** → Download contact lists for backup or sharing.
- **Import from CSV or vCard** → Easily onboard data from other apps.

---

### 💬 Phase 3 – Communication & Automation
- **Click-to-call / click-to-email** → Instantly open phone dialer or email client.
- **Reminders / birthday notifications** → Push notifications for birthdays.

---

## 🛠 Tech Stack

**Frontend:**
- React + TypeScript + Vite
- TailwindCSS for styling
- React Router for navigation
- Context API for global loading spinner
- React Hot Toast for notifications

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL database
- Joi validation for inputs
- Multer for file uploads (avatars, imports)
- Nodemailer (Gmail SMTP) for Forgot Password

**Other:**
- JWT Authentication
- CSV/vCard parsing
- Responsive design

---
```
## 📂 Project Structure
/frontend
├── src/
│ ├── auth/ # Login, Signup, ForgotPassword, ResetPassword
│ ├── components/ # UI components (Spinner, Header, etc.)
│ ├── context/ # Loading context
│ ├── pages/ # Contacts
│ ├── api.ts # API client (fetch wrapper)
│ └── App.tsx
/backend
├── prisma/ # Schema & migrations
├── src/
│ ├── middleware/ # Auth routes & errorHandler
│ ├── routes/ # Contact CRUD, auth (forgot/reset password), import routes
│ ├── controllers/ # contactController
│ ├── utils/ # Validation, helpers
│ └── index.ts # Express entrypoint

```
---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/JOULifestyle/Contact-Management-App.git
cd contact-management-app
2️⃣ Backend Setup
cd backend
npm install
Configure .env:

env
DATABASE_URL="postgresql://user:password@localhost:5432/contactsdb"
JWT_SECRET="your-secret-key"
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_generated_app_password
Run migrations:

npx prisma migrate dev
Start backend:
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
Configure .env:

env
VITE_API_BASE=http://localhost:8000
Start frontend:
npm run dev

🔑 Forgot Password Setup
Enable 2-Step Verification on your Gmail account.

Generate an App Password (Google Account → Security → App Passwords).

Use that password in your .env (EMAIL_PASS).

Flow:

POST /auth/forgot-password with { email } → sends reset link.

POST /auth/reset-password/:token with { newPassword } → resets password.

🖥 Usage
Sign up / log in to access your contacts.

Add, edit, or delete contacts with custom fields.

Use tags and sorting for organization.

Import/export contacts via CSV or vCard.

Enable bulk actions for managing large lists.

Get reminders for birthdays.

Reset password via Gmail reset link.

📌 Roadmap
Two-way sync with Google Contacts / Outlook

Backup

Group messaging via WhatsApp/Telegram

Calendar integration for reminders

📄 License
MIT License © 2025 Israel Olasehinde – JOULifestyle