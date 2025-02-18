const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a user by ID
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a user by ID (bonus: also delete associated thoughts)
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated thoughts
    await Thought.deleteMany({ username: user.username });
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add friend to user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found' });
    }

    user.friends.push(friend._id);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove friend from user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found' });
    }

    user.friends.pull(friend._id);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
