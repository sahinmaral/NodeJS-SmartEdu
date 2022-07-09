const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;
mongoose.plugin(slug);

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug:{
    type:String,
    unique:true,
    slug: "name"
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
