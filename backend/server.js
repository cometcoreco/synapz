require('dotenv').config(); // Add this at the top if you're using dotenv for environment variables

const stripe = require('./stripe'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');
const { OpenAI } = require('openai'); 

const app = express();
app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// New endpoint for creating a chatbot
app.post('/api/create-bot', async (req, res) => {
  const { name, botModel, message } = req.body;
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