const mongoose = require('mongoose');
var multer = require('multer');
const router = require('express').Router();

const { Schema } = mongoose;

const ArticlesSchema = new Schema({
  title: String,
  body: String,
  author: String,
  related: String,
  file:String,
  filename:String,
  image:String
}, { timestamps: true });

ArticlesSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    body: this.body,
    author: this.author,
    related: this.related,
    file: this.file,
    filename:this.filename,
    image:this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};
mongoose.model('Articles', ArticlesSchema);
