const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Study Material', 'Video', 'Website', 'Book', 'Tool', 'Other'],
    },
    subject: {
      type: String,
      required: [true, 'Please specify a subject'],
      enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Economics', 'Other'],
    },
    url: {
      type: String,
      required: [true, 'Please provide a resource URL'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
