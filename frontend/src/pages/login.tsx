import { useState } from "react";
import { CustomInput } from "../components/CustumInput";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add your login logic here
  };
  return (
    <div className="bg-white flex items-center justify-center max-h-screen w-screen">
      <div className="w-full max-w-sm px-6 pt-12">
        {/* BACK */}
        <h1 className="font-inter font-black text-2xl mb-6">← Back</h1>
        {/* LOGO */}
        <img src="./src/assets/logo.png" alt="" />

        {/* LOGIN CONTAINER */}
        <h2 className="items-start justify-start ml-5 font-inter font-black">
          Login To Your Account
        </h2>
        <form className="flex flex-col gap-4">
          <CustomInput
            label="Email:"
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={setEmail}
          />
          <CustomInput
            label="Password:"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={setPassword}
          />

          {/* Submit btn */}
          <button onClick={handleSubmit}>
            <div className="bg-indigo-600 text-white rounded-lg px-4 h-12 py-2 text-center items-center justify-center flex hover:bg-indigo-700 transition-colors font-bold">
              LOGIN
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
