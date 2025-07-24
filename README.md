# QualityTracker

**Cross-Platform Project & Process Management App**

QualityTracker helps teams track and manage all mandatory steps and processes for various project types, ensuring consistent quality and smooth project phase transitions.

---

## 🚨 Major Project Structure Change
- **Now 100% JavaScript/JSX:** All TypeScript files and dependencies have been removed. The project is now pure JS/JSX for easier builds and maintenance.
- **Build system:** Uses Vite for the renderer and Electron for the desktop shell.

---

## Features
- **Dashboard:** Dynamic work type cards (add/edit/delete, deadlines, progress)
- **Step Management:** Add, edit, delete, reorder (drag-and-drop), and mark steps as complete. Mandatory steps are visually distinct.
- **Progress Tracking:** Visual progress bar, mandatory step completion enforcement.
- **Settings:**
  - Theme switching (System, Light, Dark)
  - Default mandatory steps configuration
  - Notification preferences (deadline reminders)
  - Data export/import (backup/restore)
  - Accessibility (font size)
- **Help:** Built-in instructions
- **About:** Developer info and MIT license
- **Data Persistence:** All data/settings are saved automatically

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Platform-specific build tools (see documentation.txt for details)

### Install Dependencies
```bash
npm install
```

### Build the Renderer
```bash
npx vite build
```

### Run in Development Mode
```bash
npx electron .
```


### Build Linux Installers (deb, rpm, AppImage)
```bash
npm run dist
```
Installers will be created in the `dist/` directory. See `documentation.txt` for details on output locations per platform.

### Build Windows Installer (NSIS .exe)
```bash
npm run dist:win
```
The Windows installer (.exe) will be created in the `dist/` directory. See `documentation.txt` for details.

### Build macOS Installer (.dmg)
```bash
npm run dist:mac
```
The macOS installer (.dmg) will be created in the `dist/` directory. See `documentation.txt` for details.

---

## Supported Platforms & Installers
- **Linux:** `.deb` (Debian/Ubuntu), `.rpm` (Fedora/RHEL), `.AppImage` (portable)
- **Windows & macOS:** See documentation.txt for packaging instructions

---

## Troubleshooting
- For packaging errors, missing output files, or advanced build options, see `documentation.txt`.

---

## Contact & License
- Developed by Md Jahid Hasan
- Email: mdjahidhasan919@gmail.com
- Website: https://hmjahid.netlify.app/
- License: MIT (see About page) 