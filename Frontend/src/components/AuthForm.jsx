import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, signupRequest } from "../redux/actions/authSlice";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ isSignUp = false }) {
  const [form, setForm] = useState({ email: "", password: "", role: "mentee" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      dispatch(signupRequest(form));
    } else {
      dispatch(loginRequest({ email: form.email, password: form.password }));
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          required
        />

        {isSignUp && (
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-sm text-center">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a href="/signin" className="text-blue-600 underline">
                Sign In
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 underline">
                Sign Up
              </a>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
