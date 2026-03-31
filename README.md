# Expense Tracker Web Application

A modern, high-performance financial management dashboard built with **React**, **TypeScript**, **Vite**, and **Supabase**. This application provides real-time expense tracking, interactive data visualization, and a responsive administrative interface.

## 🚀 Key Features

* **Financial Dashboard:** High-level overview of spending habits using interactive charts.
* **Expense Management:** Full CRUD (Create, Read, Update, Delete) functionality for financial records. 
* **Interactive Visualizations:**
    * Donut charts for category-wise distribution. 
    * Interactive area and bar charts for trend analysis. 
* **Advanced Data Tables:** Filterable and sortable transaction logs with detailed viewing capabilities.
* **Authentication:** Secure user login and session management via Supabase Auth.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing using a modern sidebar navigation system. 

## 🛠 Tech Stack

* **Core:** React 18, TypeScript 
* **Build Tool:** Vite 
* **Backend-as-a-Service:** Supabase (Database & Auth) 
* **Styling:** Tailwind CSS (via shadcn/ui components) 
* **Charts:** Recharts / Radix-based visualization components 
* **Icons:** Lucide React

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
