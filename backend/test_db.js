import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/GrowWithAI';

const childSchema = new mongoose.Schema({
  id: Number,
  name: String,
  milestones: Array
}, { strict: false });

const Child = mongoose.model('Child', childSchema);

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('--- Database Check ---');
    const children = await Child.find();
    console.log(`Found ${children.length} children.`);
    children.forEach(c => {
      console.log(`- ${c.name} (id: ${c.id})`);
      console.log(`  Milestones checked: ${c.milestones.filter(m => m.completed).length}`);
    });
    console.log('----------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
