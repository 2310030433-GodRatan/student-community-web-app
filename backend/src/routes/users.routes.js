const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Note = require('../models/Note');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth.middleware');
const handleValidationErrors = require('../middleware/validation.middleware');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's notes and resources count
    const notesCount = await Note.countDocuments({ author: user._id });
    const resourcesCount = await Resource.countDocuments({ author: user._id });

    res.status(200).json({
      user: user.toJSON(),
      stats: {
        notes: notesCount,
        resources: resourcesCount,
        followers: user.followers.length,
        following: user.following.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put(
  '/:id',
  protect,
  [
    body('name').optional().notEmpty(),
    body('bio').optional().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      // Check if user is updating their own profile
      if (req.user._id.toString() !== req.params.id) {
        return res.status(401).json({ message: 'Not authorized to update this profile' });
      }

      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: 'Profile updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Follow user
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);

      await currentUser.save();
      await userToFollow.save();
    }

    res.status(200).json({
      message: 'User followed successfully',
      following: currentUser.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow user
router.post('/:id/unfollow', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(req.params.id)) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );

      await currentUser.save();
      await userToUnfollow.save();
    }

    res.status(200).json({
      message: 'User unfollowed successfully',
      following: currentUser.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's notes
router.get('/:id/notes', async (req, res) => {
  try {
    const notes = await Note.find({ author: req.params.id, isPublished: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's resources
router.get('/:id/resources', async (req, res) => {
  try {
    const resources = await Resource.find({ author: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
