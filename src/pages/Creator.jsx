import { useState, useEffect } from "react";

const interestsList = [
  "Music",
  "Food",
  "Parties",
  "Business",
  "Hobbies",
];

export default function Creator() {

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    city: "",
    registrationUrl: "",
    interest: interestsList[0],
    poster: null,
  });
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [editEvent, setEditEvent] = useState(null);


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) { 
      window.location.href = "/login";
      return;
    }
    setUser(userData);
    fetchEvents(userData.email);
  }, []);
  const fetchEvents = async (email) => {
    try {
      const res = await fetch( `http://localhost:5000/api/events/creator/${email}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) { console.error("Error fetching events:", err);}
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, poster: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("Not logged in!");
      return;
    }
    if (!form.city) {
      setMessage("Please enter a city.");
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("city", form.city);
    formData.append("registrationUrl", form.registrationUrl);
    formData.append("interest", form.interest);
    formData.append("poster", form.poster);
    formData.append("creatorId", user.id);

    const res = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Event created successfully!");
      setForm({ title: "", description: "", startDate: "", endDate: "", city: "", registrationUrl: "", interest: interestsList[0], poster: null,});
      setShowForm(false);
      fetchEvents(user.email); 
    } else {
      setMessage("❌ Error: " + data.error);
  }};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("🗑️ Event deleted");
      fetchEvents(user.email); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleEdit = (event) => {
    setEditEvent({
      ...event,
      startDate: event.startDate ? event.startDate.slice(0, 10) : "",
      endDate: event.endDate ? event.endDate.slice(0, 10) : "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({ ...editEvent, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editEvent) return;
    const res = await fetch(`http://localhost:5000/api/events/${editEvent._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editEvent.title, description: editEvent.description, startDate: editEvent.startDate, endDate: editEvent.endDate, location: editEvent.location || editEvent.city, registrationUrl: editEvent.registrationUrl, interest: editEvent.interest,}),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Event updated!");
      setEditEvent(null);
      fetchEvents(user.email); 
    } else {
      setMessage("❌ Error: " + data.error);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50">

      <header className="bg-[#1e1e2f] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
            {user && user.username ? user.username[0].toUpperCase() : "?"}
          </div>
          <span className="font-semibold">{user && user.username}</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleLogout} className="bg-gray-700 px-3 py-2 rounded-lg font-semibold hover:bg-gray-900"> Logout </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
            {showForm ? "Cancel" : "Create Event"}
          </button>
        </div>
      </header>

      <main className="p-6">
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-600"> New Event </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
              <textarea name="description" placeholder="Event Description" value={form.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required/>
              <label className="block font-semibold text-gray-700">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />              
              <label className="block font-semibold text-gray-700">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"required/>
              <input type="text" name="city" placeholder="Event City" value={form.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required/>
              <input type="url" name="registrationUrl" placeholder="Registration Website URL" value={form.registrationUrl} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              <select name="interest" value={form.interest} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required>
                {interestsList.map((int) => (
                  <option key={int} value={int}>{int}</option>
                ))}
              </select>
              <input type="file" name="poster" onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required/>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:scale-105 transition-transform"> Submit </button>
            </form>

            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        )}

       
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800"> Your Events </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {events.length === 0 ? ( <p className="text-gray-500">No events created yet.</p> ) : 
          ( events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-md w-72 overflow-hidden transform hover:scale-105 transition" >
                <img src={event.imageUrl} alt={event.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-purple-600"> {event.title} </h3>
                  <p className="text-gray-700">{event.description}</p>
                  <p className="text-sm text-gray-500"> <strong>Location:</strong> {event.location} </p>
                  <p className="text-sm text-gray-500">
                    <strong>Dates:</strong>{" "}
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : ""}
                    {event.endDate ? " - " + new Date(event.endDate).toLocaleDateString() : ""}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button onClick={() => handleDelete(event._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" > Delete </button>
                    <button onClick={() => handleEdit(event)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600" > Update </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        {editEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={() => setEditEvent(null)}> &times; </button>
              <h2 className="text-xl font-bold mb-4 text-purple-600">Edit Event</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input type="text" name="title" value={editEvent.title} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required />
                <textarea name="description" value={editEvent.description} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required/>
                <label className="block font-semibold text-gray-700">Start Date</label>
                <input type="date" name="startDate" value={editEvent.startDate} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required />
                <label className="block font-semibold text-gray-700">End Date</label>
                <input type="date" name="endDate" value={editEvent.endDate} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required />
                <input type="text" name="location" value={editEvent.location} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required />
                <input type="url" name="registrationUrl" value={editEvent.registrationUrl} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" />
                <select name="interest" value={editEvent.interest} onChange={handleEditChange} className="w-full border rounded-lg px-3 py-2" required>
                  {interestsList.map((int) => (
                    <option key={int} value={int}>{int}</option>
                  ))}
                </select>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:scale-105 transition-transform" > Save </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
