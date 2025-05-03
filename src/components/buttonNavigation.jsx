import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function ButtonNavigation({ title }) {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div>
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {title}
      </h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          Logout
        </Button>

        <Button
          onClick={() => navigateTo("/income")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
        >
          Income
        </Button>

        <Button
          onClick={() => navigateTo("/expense")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
        >
          Expense
        </Button>

        <Button
          onClick={() => navigateTo("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}

export default ButtonNavigation;
