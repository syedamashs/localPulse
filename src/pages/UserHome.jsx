import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

export default function UserHome() {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [interests] = useState([
    { icon: "🎵", name: "Music" },
    { icon: "🍽️", name: "Food" },
    { icon: "🎉", name: "Parties" },
    { icon: "💼", name: "Business" },
    { icon: "🎨", name: "Hobbies" },
  ]);
  const eventsRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");

  // Helper: Get city coordinates (demo, use a real lookup for production)
  const cityCoords = {
    Chennai: [13.0827, 80.2707],
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.6139, 77.2090],
    Bengaluru: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Kolkata: [22.5726, 88.3639],
    Madurai: [9.9252, 78.1198],
    // Add more cities as needed
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      window.location.href = "/";
      return;
    }
    setUser(userData);
    fetchEvents(); // always fetch events on load
    // Removed geolocation logic
  }, []);

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(
        data.map((ev) => ({
          ...ev,
          image: ev.imageUrl || "",
          location: ev.location || "",
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-[#1e1e2f] text-white px-6 py-4 flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold">LocalPulse</h1>
        <nav className="flex gap-6 items-center">
          <Link to="/user" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/user" className="text-gray-300 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              eventsRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          > Events</Link>
          <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
          <span className="ml-4 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">
              {user && user.username ? user.username[0].toUpperCase() : "?"}
            </div>
            <span className="font-semibold">{user && user.username}</span>
            <button
              onClick={handleLogout}
              className="ml-2 bg-gray-700 px-2 py-1 rounded hover:bg-gray-900"
            >
              Logout
            </button>
          </span>
        </nav>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Discover the Hottest Parties & Events Near You!
        </h2>
        <p className="mb-6 text-lg">
          Welcome <strong>{user ? user.username : "Guest"}</strong>! Find
          energetic, trustworthy, and fun experiences tailored for youth and
          travelers.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap justify-center gap-3"
        >
          <input
            type="text"
            placeholder="Search by location or event..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 rounded-md text-black w-64 border-2 border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            style={{ boxShadow: "0 0 0 2px #ec4899" }}
          />
          <button
            type="submit"
            className="bg-white text-pink-600 font-bold px-5 py-2 rounded-md hover:bg-gray-100 transition border-2 border-pink-500"
          >
            Search
          </button>
        </form>
      </section>

      {/* INTERESTS */}
      <section className="bg-gray-50 py-12 text-center">
        <h3 className="text-xl font-bold mb-6">Explore Interests</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {interests.map((interest, i) => (
            <div
              key={i}
              className={`text-4xl cursor-pointer ${
                selectedInterest === interest.name ? "text-pink-600 scale-110" : ""
              }`}
              onClick={() =>
                setSelectedInterest(
                  selectedInterest === interest.name ? null : interest.name
                )
              }
            >
              <span>{interest.icon}</span>
              <p className="mt-2 text-base font-semibold">
                {interest.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section ref={eventsRef} className="py-12 px-6 flex-1">
        <h3 className="text-xl font-bold text-center mb-8">Upcoming Events</h3>
        {/* Location Filter */}
        <div className="flex justify-center mb-6 gap-2">
          <input
            type="text"
            placeholder="Filter by location (city)..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 rounded-md border-2 border-pink-500 w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            className="bg-pink-600 text-white font-bold px-5 py-2 rounded-md hover:bg-pink-700 transition"
            onClick={() => setLocationFilter(locationFilter.trim())}
          >
            Filter
          </button>
          <button
            className="bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-md hover:bg-gray-300 transition"
            onClick={() => setLocationFilter("")}
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {events
            .filter((e) =>
              e.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .filter((e) =>
              selectedInterest ? e.interest === selectedInterest : true
            )
            .filter((e) =>
              locationFilter
                ? e.location &&
                  e.location.toLowerCase().includes(locationFilter.toLowerCase())
                : true
            )
            .slice(0, 5)
            .map((event, i) => (
              <div
                key={event._id || i}
                className="bg-white rounded-lg shadow-md w-72 overflow-hidden transform hover:scale-105 transition cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-pink-600">
                    {event.title}
                  </h4>
                  <p className="text-gray-700">{event.location}</p>
                  <p className="text-sm text-gray-500">
                    {event.startDate
                      ? new Date(event.startDate).toLocaleDateString()
                      : ""}
                    {event.endDate
                      ? " - " + new Date(event.endDate).toLocaleDateString()
                      : ""}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (event.registrationUrl) {
                        window.open(event.registrationUrl, "_blank");
                      }
                    }}
                    className="inline-block mt-4 px-4 py-2 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700"
                  >
                    Join Event
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 text-xl"
                onClick={() => setSelectedEvent(null)}
              >
                &times;
              </button>
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-2xl font-bold text-pink-600 mb-2">
                {selectedEvent.title}
              </h2>
              <p className="mb-2 text-gray-700">{selectedEvent.description}</p>
              <p className="mb-2 text-gray-700">
                <strong>Location:</strong> {selectedEvent.city}
              </p>
              <p className="mb-2 text-gray-700">
                <strong>Dates:</strong>{" "}
                {selectedEvent.startDate
                  ? new Date(selectedEvent.startDate).toLocaleDateString()
                  : ""}
                {selectedEvent.endDate
                  ? " - " + new Date(selectedEvent.endDate).toLocaleDateString()
                  : ""}
              </p>
              {selectedEvent.registrationUrl && (
                <a
                  href={selectedEvent.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 px-4 py-2 bg-pink-600 text-white rounded-md font-semibold text-center hover:bg-pink-700"
                >
                  Go to Registration Site
                </a>
              )}
            </div>
          </div>
        )}
      </section>
      {/* MAP SECTION */}
      {!selectedEvent && (
        <section className="py-12 px-6">
          <h3 className="text-xl font-bold text-center mb-8">Event Map</h3>
          <div style={{ height: "400px", width: "100%", position: "relative" }}>
            <MapContainer
              center={[22.9734, 78.6569]} // Center of India
              zoom={5}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {events.map((ev, idx) => {
                let coords = null;
                if (ev.latitude && ev.longitude) {
                  coords = [ev.latitude, ev.longitude];
                } else if (ev.location && cityCoords[ev.location]) {
                  coords = cityCoords[ev.location];
                }
                if (!coords) return null;
                return (
                  <Marker key={ev._id || idx} position={coords}>
                    <Popup>
                      <div>
                        <strong>{ev.title}</strong>
                        <br />
                        {ev.location}
                        <br />
                        {ev.startDate
                          ? new Date(ev.startDate).toLocaleDateString()
                          : ""}
                        {ev.endDate
                          ? " - " + new Date(ev.endDate).toLocaleDateString()
                          : ""}
                        <br />
                        <button
                          onClick={() => {
                            if (ev.registrationUrl) {
                              window.open(ev.registrationUrl, "_blank");
                            }
                          }}
                          className="mt-2 px-2 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                          Join Event
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#1e1e2f] text-white py-4 text-center">
        <nav className="mb-2 space-x-3">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Events
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Terms
          </a>
        </nav>
        <p className="text-sm">&copy; 2025 LocalPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
