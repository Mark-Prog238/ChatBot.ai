import { useState } from "react";
import { CustomInput } from "../components/CustumInput";
export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [lastname, setLastName] = useState("");
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
          Create Your Account
        </h2>
        <form className="flex flex-col gap-4">
          {/* name */}
          <CustomInput
            label="Name:"
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={setName}
          />
          {/* name */}
          <CustomInput
            label="Surname:"
            type="text"
            name="lastname"
            id="lastname"
            value={lastname}
            onChange={setLastName}
          />
          {/* Password */}
          <CustomInput
            label="Email:"
            type="email"
            name="email"
            id="email"
            value={password}
            onChange={setEmail}
          />
          {/* Password */}
          <CustomInput
            label="Password:"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={setPassword}
          />
          {/* Confirm Password */}
          <CustomInput
            label="Confirm Password:"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
          />
          {/* Submit btn */}
          <button onClick={handleSubmit}>
            <div className="bg-indigo-600 text-white rounded-lg px-4 h-12 py-2 text-center items-center justify-center flex hover:bg-indigo-700 transition-colors font-bold">
              CREATE
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
