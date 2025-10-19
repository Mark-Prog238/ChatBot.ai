import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomInput } from "../components/CustumInput";
import { useAuth } from "../contexts/AuthContext";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [lastname, setLastName] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !passwordConfirm.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");

    try {
      const fullName = `${name} ${lastname}`;
      const success = await register(fullName, email, password);
      if (success) {
        navigate("/chat");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen w-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Home
          </Link>
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Sign In
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              {/* LOGO */}
              <div className="flex justify-center mb-8">
                <img
                  src="./src/assets/icon.png"
                  alt="Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>

              {/* REGISTER CONTAINER */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join us and start chatting with AI
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomInput
                    label="First Name"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <CustomInput
                    label="Last Name"
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={lastname}
                    onChange={setLastName}
                    required
                  />
                </div>

                <CustomInput
                  label="Email Address"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={setEmail}
                  required
                />

                <CustomInput
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={setPassword}
                  required
                />

                <CustomInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg px-4 h-12 font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
