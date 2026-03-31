# Expense Tracker Web Application

A modern, high-performance financial management dashboard built with **React**, **TypeScript**, **Vite**, and **Supabase**. This application provides real-time expense tracking, interactive data visualization, and a responsive administrative interface.

## 🚀 Key Features

* **Financial Dashboard:** High-level overview of spending habits using interactive charts. [cite: 17, 18, 22, 39]
* **Expense Management:** Full CRUD (Create, Read, Update, Delete) functionality for financial records. [cite: 111, 120]
* **Interactive Visualizations:**
    * Donut charts for category-wise distribution. [cite: 39]
    * Interactive area and bar charts for trend analysis. [cite: 17, 18, 22]
* **Advanced Data Tables:** Filterable and sortable transaction logs with detailed viewing capabilities. [cite: 24, 26, 31, 101]
* **Authentication:** Secure user login and session management via Supabase Auth. [cite: 46, 112]
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing using a modern sidebar navigation system. [cite: 16, 91, 113]

## 🛠 Tech Stack

* **Core:** React 18, TypeScript [cite: 11, 126]
* **Build Tool:** Vite [cite: 122, 127]
* **Backend-as-a-Service:** Supabase (Database & Auth) 
* **Styling:** Tailwind CSS (via shadcn/ui components) [cite: 61, 62, 65]
* **Charts:** Recharts / Radix-based visualization components [cite: 17, 18, 71]
* **Icons:** Lucide React [cite: 126]

## 📂 Project Structure

```text
src/
├── app/               # Application-level providers and dashboard data
├── components/        # Reusable UI widgets
│   ├── ui/            # Primitive components (Button, Input, Sidebar, etc.)
│   └── ...            # Feature-specific components (ExpenseDrawer, Charts)
├── context/           # Global state (ExpensesContext)
├── hooks/             # Custom logic (useAuth, useMobile, useStats)
├── interfaces/        # TypeScript type definitions
├── lib/               # Third-party configurations (Supabase client, Utils)
├── pages/             # Main route views (Dashboard, Expenses)
└── utils/             # Business logic and calculations
```

## ⚙️ Setup & Installation

### Prerequisites
* **Node.js** (v18 or higher) 
* A **Supabase account** and project 

### Steps
1. **Clone and Extract:**
   Extract the contents of `WebApp.rar` into your project directory. 

2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Environment Configuration:**
   ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
5. **Build for Production:**
   ```bash
   npm run build
   ```
