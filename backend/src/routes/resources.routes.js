const express = require('express');
const { body } = require('express-validator');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth.middleware');
const handleValidationErrors = require('../middleware/validation.middleware');

const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { subject, category, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (subject) {
      filter.subject = subject;
    }
    if (category) {
      filter.category = category;
    }

    const resources = await Resource.find(filter)
      .populate('author', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(filter);

    res.status(200).json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create resource
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('url').isURL().withMessage('Valid URL is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, category, subject, url, tags } = req.body;

      const resource = new Resource({
        title,
        description,
        category,
        subject,
        url,
        tags: tags || [],
        author: req.user._id,
      });

      await resource.save();
      await resource.populate('author', 'name avatar');

      res.status(201).json({
        message: 'Resource created successfully',
        resource,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update resource
router.put(
  '/:id',
  protect,
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('url').optional().isURL(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      let resource = await Resource.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user is the author
      if (resource.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this resource' });
      }

      resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('author', 'name avatar');

      res.status(200).json({
        message: 'Resource updated successfully',
        resource,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete resource
router.delete('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is the author
    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like resource
router.post('/:id/like', protect, async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.likes.includes(req.user._id)) {
      resource.likes = resource.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      resource.likes.push(req.user._id);
    }

    await resource.save();

    res.status(200).json({
      message: 'Resource liked successfully',
      likes: resource.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
