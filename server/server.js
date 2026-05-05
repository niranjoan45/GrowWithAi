import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GrowWithAI';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB at growWithAI'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Parent' }
});

const User = mongoose.model('User', userSchema);

const childSchema = new mongoose.Schema({
  id: Number, // Explicitly allow numeric IDs from frontend
  name: String,
  age: String,
  gender: String,
  dob: String,
  progress: Number,
  lmsScore: Number,
  status: String,
  symmetryGap: Number,
  milestones: [
    {
      id: Number,
      category: String,
      title: String,
      completed: Boolean
    }
  ]
});

const Child = mongoose.model('Child', childSchema);

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // For hackathon: Auto-register if user doesn't exist
      user = new User({ email, password, name: 'Parent' });
      await user.save();
    }
    
    // In real app, check password. For hackathon, just log in.
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Child Routes ---
app.get('/api/children', async (req, res) => {
  try {
    const children = await Child.find();
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/children', async (req, res) => {
  const childData = req.body;
  
  try {
    let child = await Child.findOne({ name: childData.name });
    if (child) {
      // Remove internal _id if present to avoid casting conflicts
      const { _id, ...updateData } = childData;
      Object.assign(child, updateData);
      await child.save();
    } else {
      child = new Child(childData);
      await child.save();
    }
    console.log(`✅ Saved to MongoDB: ${childData.name}`);
    res.json(child);
  } catch (err) {
    console.error(`❌ Save Error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/children/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Child.findOneAndDelete({ id: parseInt(id) });
    console.log(`✅ Deleted child with ID: ${id}`);
    res.json({ message: 'Child deleted successfully' });
  } catch (err) {
    console.error(`❌ Delete Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
