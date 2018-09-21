const mongoose = require('mongoose');
var multer = require('multer');
const router = require('express').Router();

const { Schema } = mongoose;

const ArticlesSchema = new Schema({
  title: String,
  body: String,
  author: String,
  related: String,
  file:String
  
}, { timestamps: true });

ArticlesSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    body: this.body,
    author: this.author,
    related: this.related,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    file:this.file,
  };
};
mongoose.model('Articles', ArticlesSchema);
