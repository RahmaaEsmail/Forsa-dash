import React from "react";
import LoginImage from "../../components/pages/Login/LoginImage";
import LoginForm from "../../components/pages/Login/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen py-2  flex items-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 p-2 lg:grid-cols-2 overflow-hidden bg-white rounded-[40px] shadow-sm">
          {/* Left: Form */}
         <LoginForm />
          {/* Right: Image */}
          <LoginImage />
        </div>
      </div>
    </div>
  );
}