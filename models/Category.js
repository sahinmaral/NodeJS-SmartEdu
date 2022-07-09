const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;
mongoose.plugin(slug);

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug:{
    type:String,
    unique:true,
    slug: "name"
  }
});


const Category = mongoose.model('categories',CategorySchema)

module.exports = Category