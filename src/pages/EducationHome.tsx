import React from "react";

const EducationHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img
          src="/src/assets/gullak_img3.png"
          alt="Lets know about My Gullak"
          className="w-48 h-48 object-contain mb-6"
        />
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
          Come, Let's know about My Gullak
        </h1>
        <p className="text-lg text-blue-700 mb-6 text-center">
          Welcome to My Gullak! Here you can learn about smart saving, financial
          planning, and building a secure future. Explore interactive lessons,
          tips, and resources to become financially savvy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
            Start Learning
          </button>
          <button className="bg-white border border-blue-400 text-blue-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 hover:text-blue-900 transition">
            Explore Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationHome;