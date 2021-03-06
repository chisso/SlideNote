var mongoose = require('mongoose')
  , Schema
  , Model
  , Keyword
  , db
  ;

db = mongoose.connect('mongodb://localhost/slide_note')

Schema = new mongoose.Schema({
  id:          {type: Number, required: true},
  length:      {type: Number, required: true},
  title:       {type: String, required:true, trim: true},
  author:      {type: String, trim: true},
  description: {type: String, trim: true},
  tag:         [{type: String}],
  slides:      [{type: String}],
  updated:     {type: Date, default: Date.now}
});

Model = db.model('slide', Schema);

exports.Model = Model;

exports.findOne = function (id, callback) {
  Model.find({id: id}, function (err, docs) {
    callback(err, docs);
  });
};

exports.find = function (keyword, callback) {
  var exp1 = new RegExp(keyword, 'i')
    ;

  Model.find({
    $or: [
      {title: exp1},
      {description: exp1},
      {tag: {$in: [keyword]}}
    ]
  }, function (err, docs) {
    callback(err, docs);
  });
};

exports.save = function (data, callback) {
  var slide
    ;

  slide = new Model({
    id: data.id,
    length: data.slides.length,
    title: data.title,
    author: data.author,
    description: data.desc,
    tag: data.tag || [],
    slides: data.slides
  });

  slide.save(function (err) {
    callback(err);
  });
};
