---

# 🎸 Guitar Tab Studio

A web-based guitar tab editor and visualizer built with React.
Create, edit, preview, and export guitar tabs with an interactive fretboard and PDF export support.

---

## 🌐 Live Demo

👉 **App Link:**
[https://IamSamyak.github.io/guitar-tab-studio/](https://IamSamyak.github.io/guitar-tab-studio/)

---

## ✨ Features

* 🎸 Interactive guitar fretboard
* 🧠 Visual tab preview
* 🔊 Sound playback for notes
* 🎯 Capo support
* 📄 Export tabs to PDF
* 🎨 Color-coded notes
* ⚡ Real-time editing
* 💾 Zustand-based state management

---

## 🛠 Tech Stack

* React (CRA)
* Zustand (state management)
* Tone.js (audio playback)
* html2canvas (rendering UI)
* jsPDF (PDF export)
* Tailwind CSS

---

## 📦 Installation

```bash
git clone https://github.com/IamSamyak/guitar-tab-studio.git
cd guitar-tab-studio
npm install
npm start
```

App will run at:

```
http://localhost:3000
```

---

## 🧪 Build

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

---

## 🚀 Deployment (GitHub Actions)

This project uses **GitHub Actions + GitHub Pages** for deployment.

Deployment is triggered via **version tags**.

---

## 🏷️ Creating a Release (Developer Guide)

Follow these steps to deploy a new version:

### 1. Make your changes

```bash
git add .
git commit -m "feat: your changes description"
git push origin main
```

---

### 2. Create a version tag

Use semantic versioning:

* `v1.0.0` → initial release
* `v1.1.0` → new features
* `v1.0.1` → bug fixes

```bash
git tag v1.0.3
git push origin v1.0.3
```

---

### 3. Deployment flow

Once the tag is pushed:

* GitHub Actions workflow is triggered
* App is built
* Deployment is validated against environment rules
* Site is deployed to GitHub Pages

---

### 4. Verify deployment

* Go to **Actions tab** → check workflow status ✅
* Visit the live app:

```
https://IamSamyak.github.io/guitar-tab-studio/
```

---

## ⚙️ Environment Setup (Important)

In GitHub repo:

👉 Settings → Environments → `github-pages`

Ensure:

* Deployment type: GitHub Actions
* Allowed refs:

  * Tag pattern: `v*`
* No required reviewers (unless desired)

---

## 🧾 Project Structure (simplified)

```
src/
  components/
  utils/
  audio/
  App.js
  index.js
```

---

## 📌 Notes

* This project uses GitHub Actions for CI/CD
* No `gh-pages` branch is used
* Deployment is controlled via version tags
* React Router (if used) should use correct basename for GitHub Pages

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and open a PR

---

## 📄 License

This project is open-source and available under the MIT License.

---