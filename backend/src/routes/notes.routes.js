const express = require('express');
const { body } = require('express-validator');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth.middleware');
const handleValidationErrors = require('../middleware/validation.middleware');

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const { subject, page = 1, limit = 10 } = req.query;
    let filter = { isPublished: true };

    if (subject) {
      filter.subject = subject;
    }

    const notes = await Note.find(filter)
      .populate('author', 'name avatar major')
      .populate('comments.user', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments(filter);

    res.status(200).json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar bio major')
      .populate('comments.user', 'name avatar');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create note
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, content, subject, tags } = req.body;

      const note = new Note({
        title,
        content,
        subject,
        tags: tags || [],
        author: req.user._id,
      });

      await note.save();
      await note.populate('author', 'name avatar');

      res.status(201).json({
        message: 'Note created successfully',
        note,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update note
router.put(
  '/:id',
  protect,
  [
    body('title').optional().notEmpty(),
    body('content').optional().notEmpty(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      let note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Check if user is the author
      if (note.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this note' });
      }

      note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('author', 'name avatar');

      res.status(200).json({
        message: 'Note updated successfully',
        note,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete note
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user is the author
    if (note.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like note
router.post('/:id/like', protect, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.likes.includes(req.user._id)) {
      note.likes = note.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      note.likes.push(req.user._id);
    }

    await note.save();

    res.status(200).json({
      message: 'Note liked successfully',
      likes: note.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.comments.push({
      user: req.user._id,
      text,
    });

    await note.save();
    await note.populate('comments.user', 'name avatar');

    res.status(200).json({
      message: 'Comment added successfully',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
