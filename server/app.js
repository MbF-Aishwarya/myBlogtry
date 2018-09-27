const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const multer = require('multer');
var upload = multer({ dest: '/tmp/'});

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'LightBlog', cookie: { maxAge: 100000 }, resave: false, saveUninitialized: false }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

if(!isProduction) {
  app.use(errorHandler());
}

mongoose.connect('mongodb://localhost/lightblog', { useNewUrlParser: true });
mongoose.set('debug', true);


// Add models
require('./models/Articles');
// Add routes

//upload.single('file')
// bodyParser = {
//   json: {limit: '50mb', extended: true},
//   urlencoded: {limit: '50mb', extended: true}
// }

app.use(require('./routes'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//image upload

app.post('/file_upload', function(req, res) {
  const finalArticle = new Articles(req.body);
  return finalArticle.save()
    .then(() => res.json({ article: finalArticle.toJSON() }))
    .catch(next);
  // var file = __dirname + '/' + req.file.filename;
  // fs.rename(req.file.path, file, function(err) {
  //   if (err) {
  //     console.log(err);
  //     res.send(500);
  //   } else {
  //     res.json({
  //       message: 'File uploaded successfully',
  //       filename: req.file.filename
  //     });
  //   }
  // });
}); 

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

const server = app.listen(8000, () => console.log('Server started on http://localhost:8000'));