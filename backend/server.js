require('dotenv').config(); // Add this at the top if you're using dotenv for environment variables

const stripe = require('./stripe'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');
const { OpenAI } = require('openai'); 
const Chatbot = require('../models/Chatbot');


const app = express();
const fileUpload = require('express-fileupload'); // If you are using express-fileupload

app.use(cors());
app.use(express.json()); 
app.use(fileUpload()); // Use this middleware if you are using express-fileupload


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Endpoint to save a new chatbot
app.post('/api/chatbots', async (req, res) => {
  try {
    const { name, assistantId, userId, model, description, instructions } = req.body;
    const newChatbot = new Chatbot({
      name,
      assistantId,
      userId,
      model,
      description,
      instructions
    });
    await newChatbot.save();
    res.status(201).json({ success: true, message: 'Chatbot created successfully', chatbot: newChatbot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to list all chatbots
app.get('/api/chatbots', async (req, res) => {
  try {
    const chatbots = await Chatbot.find({}).sort({ creationDate: -1 });
    res.status(200).json({ success: true, chatbots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/save-chatbot', async (req, res) => {
  const chatbotData = req.body;
  // Logic to save chatbotData in a database or a file
  // ...
  res.status(200).json({ success: true, message: 'Chatbot saved successfully' });
});
// New endpoint for creating a chatbot
app.post('/api/create-bot', async (req, res) => {
  console.log("Request Body:", req.body); // This should show all form fields
  console.log("Files:", req.files); // This should show the uploaded files if any

  const { name, botModel, message } = req.body;
  console.log("Received botModel:", botModel); // This should not be undefined
  
const openai = new OpenAI(process.env.OPENAI_API_KEY);
  try {
      const assistant = await openai.beta.assistants.create({
          name: name,
          instructions: message,
          model: botModel,
          // Add other parameters as needed
      });

      res.status(200).json({ success: true, assistantId: assistant.id });
  } catch (error) {
      console.error('Error creating assistant:', error);
      res.status(500).json({ success: false, message: 'Failed to create assistant' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: req.body.email,
      // You can include additional information here if needed
    });

    // Add the Stripe customer ID to the user object
    user.stripeCustomerId = customer.id;

    // Save the user with the Stripe customer ID in your database
    const newUser = await user.save();

    res.status(201).json({ userId: newUser._id, stripeCustomerId: newUser.stripeCustomerId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      // User authenticated, create a token
      const token = jwt.sign({ userId: user._id }, 'Uv38ByGCZU8WP18PmmIdcpVmx00QA3xNe7sEB9Hixkk8qZ5JZG7ILh4vH8pD5TC0', { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});