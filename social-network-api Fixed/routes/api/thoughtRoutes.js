const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

// Get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single thought by ID
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);

    // Add the new thought to the user's thoughts array
    const user = await User.findOne({ username: req.body.username });
    user.thoughts.push(newThought._id);
    await user.save();

    res.json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a thought by ID
router.put('/:thoughtId', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true }
    );
    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a thought by ID
router.delete('/:thoughtId', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(
      req.params.thoughtId
    );
    res.json(deletedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    thought.reactions.push(req.body);
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    thought.reactions.pull({ _id: req.params.reactionId });
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
