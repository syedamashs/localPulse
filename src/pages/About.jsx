import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">

      <header className="bg-[#1e1e2f] text-white px-6 py-4 flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold">About LocalPulse</h1>
        <nav className="flex gap-6 items-center">
          <Link to="/user" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
        </nav>
      </header>

      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-pink-600">Welcome to LocalPulse!</h2>
        <p className="max-w-xl text-lg text-center mb-8">
          LocalPulse is your go-to platform for discovering and sharing the best events, parties, and experiences in your city. Whether you're a creator or a user, our mission is to connect people with energetic, trustworthy, and fun local happenings.
        </p>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg max-w-lg">
          <h3 className="text-xl font-bold mb-2">Why LocalPulse?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Find events tailored for youth and travelers</li>
            <li>Connect with local creators and communities</li>
            <li>Easy event creation and management</li>
            <li>Safe, verified, and vibrant experiences</li>
            <li>BY: SYED AMASH S, ANISH M, HARISH KUMAR P S</li>
          </ul>
        </div>
      </main>


      <footer className="bg-[#1e1e2f] text-white py-4 text-center">
        <p className="text-sm">&copy; 2025 LocalPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
