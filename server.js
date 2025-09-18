// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import multer from "multer";
import fetch from "node-fetch"; // already imported
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend port (Vite default)
    credentials: true,
  })
);
app.use(bodyParser.json());

// 1️⃣ MongoDB Atlas connection
mongoose
  .connect(
    "mongodb+srv://syedamash:Amash2005@test.vkgl2cz.mongodb.net/localpulse?retryWrites=true&w=majority&appName=test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "creator"], default: "user" },
});
const User = mongoose.model("User", userSchema);

// 2️⃣ Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  latitude: Number,
  longitude: Number,
  imageUrl: String,
  registrationUrl: String,
  interest: { type: String, required: true }, // new field
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Event = mongoose.model("Event", eventSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// 3️⃣ Multer setup (for file upload)
const upload = multer({ dest: "uploads/" });

// 4️⃣ Dropbox Upload Function
async function uploadToDropbox(filePath, fileName) {
  
  const dropboxAccessToken = "sl.u.AF_WJJesjUdhyVXUpyHlqyU9K3FcKY1QIopZ7db5XyDWo8v-QYL2SaLPWS2BCGh5ytTW0htEm8n64EbRzuGrGwMqWZTjjLbKXzYPDIPGocnVcgaWKUGf2G7HaaEklirEFKdVICmLxZ1ZZujMAj1a5S2oOs31nkmYh-51ikpxWI9PWm_l0Belmrya86ktwgB3xHG-3ol2u6NbhWG7cPxbUHbYVhBhYlE95hM2ebD3IBj3AHPHCLXOuLS1w9seHBoz7gCvVkBrEClnFgl5SuaEZdphDsm_e7z2lt7ixT_gEk8MwelpAYMAEZRPwTjNhO2nRdwEYoriPbmhLlAiEAF33O2LVbzIJBQeMzNiV16QeX9W8a5-_9fRPoSkqNRClmUIJbYrtrMQ10htAYGxtdfQSgeCjyl1EFkViT8iBGtwK6Bof4DD-VHhLjLDgEO8-bu7aIxu7NxHHKqc2CadBCBWT4m2Qg4D3ivrF9ax-ZlZBApGhabx54Q5o2LGU6etY9KTaK5uxuerluRH3CfWHP2jHT13lj0KvFStcobP5vIM1agEdTCFzW7jl4fkMNEaiZNgDQajXwpsEpGPEXjG3IGA93JZg1QVMr82yGmVm-eKSW0bce-RzwZi6-82AJtK4Uz2V7ZIRXF-tC1-IUniGYZJqXkAhEaQlpNLPiJhzcOs7bHORfaHQKM2b-MfpxvpGReENyr3krbrMISOdGjHL2e0Mzbe5YLb9kMv8u4JdJdfuX23LDsotB7-hc2hhAXF1Q9ExJGtKb0yjoCwa8hE70Xl6Z-NZ40959fQiYfC230173-yzXONOChwiMwV_1zLYjd1sJdm6KTpPj8_-wp_xnTZThZF4Z7Fe_cdEzSkqfdWtbhCw-OH65W2SAMyl8-La0g_bkOph92TZ9_5CZp0fvn6GScLyhe2aNPJwyJLaTqqoDhHeAigtEF70u18LnC03DfpXGxOgZzser5hLDSLXCIvcYksb5L7sLpj-XpqNLnK6xxSNMImEUTQ45tr2veSkMBQHQ1jclMA0qlS46cUqDvWFt09aUEes8JqLJiLiT0Sed8BhfYYnKdFKCLutAWfeufxFC0YZ54P_f3GbfB9MBzH-kwdzPxN2NdkTDS6esFa1wCiNLxqzhuhLcBym6ZVMlIf7SOckevSB1RiQq33bB_7GbLDHhfbuMGwnFpXO6KPri7Vzgz2RcnEtii5HDHPwSu6RYgnzfcs14id5kjb8jgIT_s8kgPqDzFUj_6cqfJ5-qRFXYEvpso7BDPhClwgvSI03QyskfAXAJkShkIQcJKi7QXyL4LjIGu3vaKEFfAl7DC5OJIGirD5Z3JcORoKgbTicvE8o0kI0LiGBspzsrbItN7ra5JdLbUcxJAcOM0SQ-QK_CSYDLoLSztqy_Dkpe39QHmLx21KmK6phzj9XtdkEDFIHj6duxAc5UkINDPgrBQpFw";
  const fileContent = fs.readFileSync(filePath);

  // Upload to Dropbox
  const uploadRes = await fetch(
    "https://content.dropboxapi.com/2/files/upload",
    {
      method: "POST",
      headers:
        {
          Authorization: `Bearer ${dropboxAccessToken}`,
          "Dropbox-API-Arg": JSON.stringify({
            path: `/${fileName}`,
            mode: "add",
            autorename: true,
            mute: false,
          }),
          "Content-Type": "application/octet-stream",
        },
      body: fileContent,
    }
  );
  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    console.error("Dropbox upload error:", errorText);
    throw new Error("Dropbox upload failed");
  }

  // Get a shared link
  const linkRes = await fetch(
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: `/${fileName}` }),
    }
  );
  const linkData = await linkRes.json();
  if (!linkRes.ok) {
    console.error("Dropbox link error:", linkData);
    throw new Error("Dropbox link failed");
  }

  // Dropbox links end with ?dl=0 → replace with raw=1 for direct use
  return linkData.url.replace("dl=0", "raw=1");
}

// City to coordinates lookup
const cityCoords = {
};

// 5️⃣ API: Create Event
app.post("/api/events", upload.any(), async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      city,
      registrationUrl,
      creatorId,
      interest,
    } = req.body;
    const file = req.files && req.files.length > 0 ? req.files[0] : null;

    if (!file) return res.status(400).json({ error: "Poster required" });

    const safeName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    const dropboxUrl = await uploadToDropbox(file.path, safeName);

    // Lookup coordinates for city
    let latitude, longitude;
    if (city && cityCoords[city]) {
      [latitude, longitude] = cityCoords[city];
    } else if (city) {
      // Fetch from Nominatim if not found locally
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json`;
        const geoRes = await fetch(url, { headers: { "User-Agent": "localpulse-app" } });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        }
      } catch (geoErr) {
        console.error("Geocoding error:", geoErr);
      }
    }

    const newEvent = new Event({
      title,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location: city || "",
      latitude,
      longitude,
      imageUrl: dropboxUrl,
      registrationUrl,
      interest,
      creator: creatorId || null,
    });
    await newEvent.save();

    res.status(201).json({ message: "✅ Event created!", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 5️⃣.1 API: Update Event
app.put("/api/events/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      registrationUrl,
      interest,
    } = req.body;

    // Get coordinates for new location
    let latitude, longitude;
    if (location) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(location)}&format=json`;
        const geoRes = await fetch(url, { headers: { "User-Agent": "localpulse-app" } });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        }
      } catch (geoErr) {
        console.error("Geocoding error:", geoErr);
      }
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        latitude,
        longitude,
        registrationUrl,
        interest,
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event updated", event: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6️⃣ API: Delete Event
app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7️⃣ API: Get Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().populate("creator", "username email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7️⃣.2 API: Get Events by Creator Email
app.get("/api/events/creator/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.json([]);
    const events = await Event.find({ creator: user._id }).populate("creator", "username email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Auth: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "supersecretkey",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, username: user.username, id: user._id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 🔑 Auth: Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res.json({ message: "✅ User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "❌ Signup failed" });
  }
});

// Contact API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.json({ message: "Contact saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact" });
  }
});

// 8️⃣ Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
