import React from "react";
import { useRouter } from "next/navigation";

function ButtonNavigation ({ title }) {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div>
      {" "}
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {title}
      </h1>
      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          Logout
        </button>
        <button
          onClick={() => navigateTo("/income")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
        >
          Income
        </button>
        <button
          onClick={() => navigateTo("/expense")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
        >
          Expense
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default ButtonNavigation;
