

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
// import "@/styles/dashboardStyle.css"
// import "@/styles/incomeStyle.css"
import "@/app/globals.css"
import Chart from "chart.js/auto";
import ButtonNavigation from "@/components/buttonNavigation";

const Dashboard = () => {
  const [month, setMonth] = useState("");
  const router = useRouter();

  const [incomeData, setIncomeData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const incomeExpenseChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  // Navigation Functions
  const navigateTo = (path) => {
    router.push(path);
  };

  // Fetch Data Function
  const fetchData = async () => {
    if (!month.trim()) {
      alert("Please enter a valid month.");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      // Fetch Income Data
      const incomeResponse = await fetch(
        `http://127.0.0.1:8000/api/auth/view_income/?month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const income = await incomeResponse.json();

      // Fetch Expense Data
      const expenseResponse = await fetch(
        `http://127.0.0.1:8000/api/auth/view_expenses/?month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const expense = await expenseResponse.json();

      // Update State
      setIncomeData(income);
      setExpenseData(expense);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update Charts
  useEffect(() => {
    if (incomeData && expenseData) {
      const ctx1 = incomeExpenseChartRef.current?.getContext("2d");
      const ctx2 = categoryChartRef.current?.getContext("2d");

      if (!ctx1 || !ctx2) return;

      // Destroy existing charts
      if (incomeExpenseChartRef.current.chart) {
        incomeExpenseChartRef.current.chart.destroy();
      }
      if (categoryChartRef.current.chart) {
        categoryChartRef.current.chart.destroy();
      }

      // Create new Pie Chart (Income vs Expenses)
      incomeExpenseChartRef.current.chart = new Chart(ctx1, {
        type: "pie",
        data: {
          labels: ["Income", "Expenses"],
          datasets: [
            {
              data: [incomeData.income, expenseData.total_expenses],
              backgroundColor: ["#28a745", "#dc3545"],
              borderColor: ["#ffffff", "#ffffff"],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } },
        },
      });

      // Create new Bar Chart (Expenses by Title)
      const titles = expenseData.expenses.map((exp) => exp.title);
      const amounts = expenseData.expenses.map((exp) => exp.amount);

      categoryChartRef.current.chart = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: titles,
          datasets: [
            {
              label: "Expenses by Title",
              data: amounts,
              backgroundColor: "#007bff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, [incomeData, expenseData]);

  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");
    return `${day}-${month}-${year}`;
}

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     
     <ButtonNavigation title={"Expense Tracker Dashboard"} />

      {/* Month Input & Load Button */}
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Enter Month (e.g., Feb)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchData}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow"
        >
          Load Data
        </button>
      </div>

      {/* Income & Expenses Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Income & Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-400">
                <th className="border border-gray-300 px-4 py-2">Month</th>
                <th className="border border-gray-300 px-4 py-2">Income</th>
                <th className="border border-gray-300 px-4 py-2">Remaining Income</th>
                <th className="border border-gray-300 px-4 py-2">Total Expenses</th>
              </tr>
            </thead>
            <tbody>
              {incomeData && expenseData ? (
                <tr className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{incomeData.month}</td>
                  <td className="border border-gray-300 px-4 py-2">{incomeData.income}</td>
                  <td className="border border-gray-300 px-4 py-2">{incomeData.remaining_income}</td>
                  <td className="border border-gray-300 px-4 py-2">{expenseData.total_expenses}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-400">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenseData ? (
                expenseData.expenses.map((expense, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{expense.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{expense.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(expense.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                    No expenses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <h2 className="text-xl font-semibold text-gray-700 text-center mt-8 mb-4">Charts</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <canvas ref={incomeExpenseChartRef} id="incomeExpenseChart" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <canvas ref={categoryChartRef} id="categoryChart" width="300" height="300" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
