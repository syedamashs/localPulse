import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("✅ Message sent!");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("❌ Failed to send. Try again.");
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      <header className="bg-[#1e1e2f] text-white px-6 py-4 flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <nav className="flex gap-6 items-center">
          <a href="/user" className="text-gray-300 hover:text-white">Home</a>
          <a href="/about" className="text-gray-300 hover:text-white">About</a>
          <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-xl shadow-lg p-8 w-full max-w-md space-y-4"
        >
          <h2 className="text-xl font-bold mb-4 text-pink-600">Send us a message</h2>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Send
          </button>
          {status && <p className="mt-2 text-center">{status}</p>}
        </form>
      </main>
      <footer className="bg-[#1e1e2f] text-white py-4 text-center">
        <p className="text-sm">&copy; 2025 LocalPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
