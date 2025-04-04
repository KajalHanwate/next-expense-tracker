'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ButtonNavigation from '@/components/buttonNavigation';
// import "../styles/incomeStyle.css"

export default function ExpenseManager() {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState('');
    const [expenseData, setExpenseData] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
        month: '',
    });
    const [editExpenseData, setEditExpenseData] = useState({ id: '', title: '', amount: '' });
    const [deleteExpenseId, setDeleteExpenseId] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    useEffect(() => {
        if (!token) {
            alert('Unauthorized! Please login first.');
            router.push('/');
        }
    }, [token, router]);

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/');
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/auth/add_category/', {
            method: 'POST', headers, body: JSON.stringify({ name: categoryName }),
        });
        const jsonRes = await response.json();

        alert(response.ok ? JSON.stringify(jsonRes) : 'Error adding category');
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/auth/add_expense/', {
            method: 'POST', headers, body: JSON.stringify(expenseData),
        });
        const jsonRes = await response.json();

        alert(response.ok ? JSON.stringify(jsonRes) : 'Error adding expense');
    };

    const handleEditExpense = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:8000/api/auth/edit_expense/${editExpenseData.id}/`, {
            method: 'PUT', headers, body: JSON.stringify(editExpenseData),
        });
        const jsonRes = await response.json();

        alert(response.ok ? JSON.stringify(jsonRes) : 'Error editing expense');
    };

    const handleDeleteExpense = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:8000/api/auth/delete_expense/${deleteExpenseId}/`, {
            method: 'DELETE', headers,
        });
        const jsonRes = await response.json();

        alert(response.ok ? JSON.stringify(jsonRes) : 'Error deleting expense');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
      
     <ButtonNavigation title={"Manage Expenses"} />

        {/* Add Category */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add Category
            </button>
          </form>
        </div>
  
        {/* Add Expense */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
          <form onSubmit={handleAddExpense} className="grid gap-4">
            <input type="text" placeholder="Title" required className="border p-2 rounded" onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })} />
            <input type="number" placeholder="Amount" required className="border p-2 rounded" onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })} />
            <input type="number" placeholder="Category ID" required className="border p-2 rounded" onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })} />
            <input type="date" required className="border p-2 rounded" onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })} />
            <input type="text" placeholder="Month (e.g., Feb)" required className="border p-2 rounded" onChange={(e) => setExpenseData({ ...expenseData, month: e.target.value })} />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Add Expense
            </button>
          </form>
        </div>
  
        {/* Edit Expense */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>
          <form onSubmit={handleEditExpense} className="grid gap-4">
            <input type="number" placeholder="Expense ID" required className="border p-2 rounded" onChange={(e) => setEditExpenseData({ ...editExpenseData, id: e.target.value })} />
            <input type="text" placeholder="New Title" className="border p-2 rounded" onChange={(e) => setEditExpenseData({ ...editExpenseData, title: e.target.value })} />
            <input type="number" placeholder="New Amount" className="border p-2 rounded" onChange={(e) => setEditExpenseData({ ...editExpenseData, amount: e.target.value })} />
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
              Edit Expense
            </button>
          </form>
        </div>
  
        {/* Delete Expense */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Delete Expense</h3>
          <form onSubmit={handleDeleteExpense} className="flex gap-4">
            <input type="number" placeholder="Expense ID" required className="border p-2 rounded w-full" onChange={(e) => setDeleteExpenseId(e.target.value)} />
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Delete Expense
            </button>
          </form>
        </div>
      </div>
    );
}