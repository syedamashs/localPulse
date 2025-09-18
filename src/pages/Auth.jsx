import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Success!");
      if (isLogin) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            email: form.email,
            role: data.role,
            token: data.token,
          })
        );

        if (data.role === "creator") {
          navigate("/creator");
        } else {
          navigate("/user");
        }
      }
    } else {
      setMessage("❌ " + data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          {isLogin ? "Login" : "Signup"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          {!isLogin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="user">User</option>
              <option value="creator">Creator</option>
            </select>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg hover:scale-105 transition-transform"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 cursor-pointer text-center"
        >
          {isLogin ? "Don’t have an account? Signup" : "Already have an account? Login"}
        </p>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
