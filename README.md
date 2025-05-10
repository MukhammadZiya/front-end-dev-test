# Frontend Developer Test – Smart Factory UI

Hi! 👋 This is my solution to the frontend assignment. I built it using React and Material UI with a focus on clean structure, responsiveness, and extra usability features.

---

## ✨ What’s Inside

### 👥 User Management
- View, add, edit, delete users
- Search and filter the user table
- Edit multiple users at once (multi-edit)
- Export data to Excel or PDF
- Confirmation before deleting

### 🧾 Forms
- Works as a modal, a split-screen panel, or a separate page
- You can choose your preferred form mode

### 🧭 Navigation
- Sidebar menu with closable tabs
- Language switcher (English 🇬🇧, Korean 🇰🇷, Russian 🇷🇺)
- Dark mode toggle (light/dark theme)

### 🌍 Multi-language Support
- UI available in 3 languages
- DataGrid texts like "No rows" are translated too
- Language preference is saved across sessions

### 🌗 Dark Mode
- Toggle between light and dark themes
- Automatically remembered using `localStorage`

---

## 🛠 Tech Stack

- React + Vite
- Material UI (MUI v5)
- Redux Toolkit
- React Router
- react-i18next (i18n)
- xlsx (Excel export)
- jsPDF (PDF export)

---

## 📁 Folder Structure (Simplified)

```
src/
├── components/       # NavBar, UserTable, Forms, Tabs
├── store/            # Redux slices (user, UI)
├── utils/            # Export to Excel/PDF
├── theme/            # ThemeContext for dark/light mode
├── locales/          # en/ko/ru translation files
├── App.jsx, main.jsx
```

---

## 🚀 Getting Started

1. Clone the repo or unzip the package
2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npm run dev
```

Open your browser at `http://localhost:500`

---

## 💬 Notes

- The UI is responsive and tested in all three form modes
- The dark/light theme and selected language are saved between sessions
- I’ve done my best to meet (and exceed) all assignment requirements

Thanks for reviewing! 🙏