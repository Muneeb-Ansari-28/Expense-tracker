# 💰 Expense Tracker with Analytics Dashboard

A sleek, modern **personal finance management web application** that helps users track income and expenses while providing intelligent insights through interactive analytics, budgets, and visual reports.

**Track smarter. Spend wiser. Build better money habits.**

![Project Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Made with](https://img.shields.io/badge/built%20with-JavaScript-yellow?style=flat-square)

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 📊 Expense Management
- ➕ Add, edit, and delete transactions with ease
- 📝 Categorize income and expenses (Food, Travel, Bills, Shopping, etc.)
- 📅 Track transactions by date with full history
- 🏷️ Add detailed descriptions for every transaction

### 📈 Analytics & Insights
- 📉 **Category-wise Spending Pie Chart** — Visualize where your money goes
- 📊 **Monthly Trend Line Chart** — Track spending patterns over time
- 💹 **Summary Dashboard** — Quick view of balance, income, expenses, and savings rate
- 📌 **Real-time Calculations** — Automatic balance and ratio updates

### 💳 Budget Management
- 💰 Set budget limits for individual categories or overall spending
- ⚠️ **Smart Budget Alerts** — Notifications when you're close to limits (≥85%) or exceed budget
- 📍 Track spending against budgets in real-time
- 🗑️ Manage and delete budgets easily

### 🔍 Advanced Filtering & Sorting
- 🔎 Search transactions by description
- 🏷️ Filter by transaction type (income/expense)
- 📂 Filter by spending category
- 📆 Filter by month and year
- ⬆️⬇️ Sort by date (newest/oldest) or amount (high/low)

### 📄 Export & Reporting
- 📕 **PDF Export** — Generate and download transaction reports with charts
- 📊 Includes full transaction table and analytics summary
- 🎯 Perfect for record-keeping and sharing

### 🔐 User Authentication
- 👤 Sign up / Login system for personal accounts
- 🛡️ Secure credential storage
- 👤 Each user maintains isolated financial data
- 🚪 Easy logout with data persistence

### 🎨 User Experience
- 🌓 **Light/Dark Mode Toggle** — Eye-friendly theme switching
- 📱 Fully responsive design (desktop, tablet, mobile)
- ⚡ Smooth animations and transitions
- 🎯 Intuitive, modern interface inspired by professional finance apps

### 💾 Data Management
- 💿 Local storage persistence — data stays private on your device
- ⚙️ No server required for demo purposes
- 📊 Automatic demo data seeding for first-time users

## 🖼️ Screenshots

**Design Reference:**  
Check [screen.png](screen.png) for the original UI mockup design inspiration.

## 🚀 Getting Started

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for first load of Chart.js and PDF libraries)

### Installation

1. **Download or Clone** the project folder to your local machine
2. **Navigate** to the expense-tracker directory
3. **Open** `index.html` in your web browser:
   - Double-click the file, or
   - Right-click → "Open With" → Select your browser

That's it! No installation, npm, or server setup needed.

### Alternative: Local Server (Optional)
For better performance, serve via a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js with http-server
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 📖 How to Use

### 1️⃣ Create Your Account
- Click the **"Sign Up"** tab on the animated auth panel
- Enter a **username** and **password**
- Click **"Sign Up"** to create your account

### 2️⃣ Log In
- Enter your **username** and **password**
- Click **"Sign In"** to access your dashboard

### 3️⃣ Add Transactions
- Select **Type**: Income or Expense
- Enter **Amount** (e.g., 50.00)
- Choose **Category** (auto-populated based on type)
- Pick a **Date**
- Add a **Description** (e.g., "Grocery shopping")
- Click **"Save Transaction"**

### 4️⃣ View Analytics
- **Summary Cards** show your total balance, income, expenses, and savings rate
- **Pie Chart** breaks down spending by category
- **Line Chart** shows monthly spending trends
- Charts update automatically as you add transactions

### 5️⃣ Set Budgets
- In the **Budget Limits** panel:
  - Select a **Category** or "Overall Spending"
  - Enter a **Limit Amount**
  - Click **"Save Budget"**
- You'll see an **alert banner** when you're close to or exceed your budget

### 6️⃣ Search & Filter Transactions
- **Search** by transaction description
- **Filter by Type** (Income/Expense/All)
- **Filter by Category**
- **Filter by Month**
- **Sort** by date or amount
- Filters work together for precise results

### 7️⃣ Export Reports
- Scroll to the **Transaction History** section
- Click **"Export PDF"** button
- Your report downloads as a PDF with transactions and charts

### 8️⃣ Toggle Theme
- Click the **theme icon** (☀️/🌙) in the top navigation
- Switch between light and dark modes instantly

### 9️⃣ Log Out
- Click the **logout icon** (🚪) in the top navigation
- You'll return to the login screen (your data is saved)

## 📁 Project Structure

```
expense-tracker/
├── index.html                # Main HTML structure and markup
├── styles.css               # Complete styling & responsive design
├── app.js                   # All app logic, state, and event handling
├── code.html                # Original static mockup (reference)
├── screen.png               # Design reference screenshot
├── README.md                # This file
└── .gitignore              # (optional) Git ignore rules
```

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Responsive design, animations, theming |
| **Vanilla JavaScript** | State management, DOM manipulation, calculations |
| **Chart.js 4** | Interactive pie and line charts |
| **jsPDF 2.5** | PDF generation and export |
| **html2canvas 1.4** | HTML-to-canvas rendering for PDF |
| **localStorage API** | Client-side data persistence |
| **Material Symbols** | Icon library for UI elements |

### No Dependencies Required!
- The app runs **standalone** in the browser
- Libraries like Chart.js and jsPDF are loaded from **CDN**
- Works **offline** after the first load (except PDF export during first use)

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully Supported |
| Firefox | Latest | ✅ Fully Supported |
| Safari | Latest | ✅ Fully Supported |
| Edge | Latest | ✅ Fully Supported |
| IE 11 | Any | ❌ Not Supported |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contribution
- Add recurring transaction support
- Implement cloud sync with Firebase
- Add expense forecasting
- Multi-currency support
- Mobile app version with React/Vue
- Advanced chart types (bar, radar, etc.)

## 📝 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

You are free to use, modify, and distribute this project for personal or commercial purposes.

## 👤 Author

Created as a comprehensive personal finance project demonstrating:
- Full-stack browser-based application development
- State management and data persistence
- Interactive data visualization
- Responsive design patterns
- User authentication flows

---

## 📧 Support & Questions

If you have questions or issues:
- Open an **Issue** on GitHub
- Check the **FAQ** section (coming soon)
- Review existing discussions

---

## 🎯 Future Roadmap

- [ ] Cloud database integration (Firebase/MongoDB)
- [ ] Mobile app version
- [ ] Recurring transactions
- [ ] Bill reminders & notifications
- [ ] Multi-user household budgeting
- [ ] Advanced tax reports
- [ ] Investment tracking
- [ ] Crypto wallet integration

---

**Made with ❤️ for better financial decisions**
