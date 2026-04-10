import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/GrowWithAI';

const userSchema = new mongoose.Schema({
  email: String,
  name: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('--- User Check ---');
    const users = await User.find();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => {
      console.log(`- ${u.name} (${u.email})`);
    });
    console.log('------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
