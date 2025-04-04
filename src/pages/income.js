'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonNavigation from "@/components/buttonNavigation";
// import "../styles/incomeStyle.css"

export default function ExpenseManager() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [incomeMonth, setIncomeMonth] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [lockMonth, setLockMonth] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) {
            alert("Unauthorized! Please login first.");
            router.push("/");
        } else {
            setToken(storedToken);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/");
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleAddIncome = async (e) => {
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:8000/api/auth/add_income/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ month: incomeMonth, income: incomeAmount }),
        });
        const jsonRes = await response.json();
        alert(response.ok ? JSON.stringify(jsonRes) : "Error Adding Income");
    };

    const handleLockIncome = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:8000/api/auth/lock_income/${lockMonth}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const jsonRes = await response.json();
        alert(response.ok ? JSON.stringify(jsonRes) : "Error Locking Income");
    };

    return (
        <div className="container mx-auto p-6">
        {/* Navigation Buttons */}
        <ButtonNavigation title={"Manage Income"} />

  
        {/* Add Monthly Income Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Monthly Income</h3>
          <form onSubmit={handleAddIncome} className="space-y-4">
            <input
              type="text"
              value={incomeMonth}
              onChange={(e) => setIncomeMonth(e.target.value)}
              placeholder="Month (e.g., Feb)"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="Income Amount"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
              Add Income
            </button>
          </form>
        </div>
  
        {/* Lock Monthly Income Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Lock Monthly Income</h3>
          <form onSubmit={handleLockIncome} className="space-y-4">
            <input
              type="text"
              value={lockMonth}
              onChange={(e) => setLockMonth(e.target.value)}
              placeholder="Month (e.g., Feb)"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
              Lock Income
            </button>
          </form>
        </div>
      </div>
    );
}
