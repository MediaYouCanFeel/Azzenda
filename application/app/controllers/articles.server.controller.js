'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	fs = require('fs'),
	_ = require('lodash');

/**
 * Create a article with Upload
 */
exports.createWithUpload = function(req, res) {
 var file = req.files.file;
 console.log(file.name);
 console.log(file.type);
 console.log(file.path);
 console.log(req.body.article);

var article = new Article(req.body.article);
article.owner = req.user;

fs.readFile(file.path, function (err,original_data) {
 if (err) {
      return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
  } 
    // save image in db as base64 encoded - this limits the image size
    // to there should be size checks here and in client
  var base64Image = original_data.toString('base64');
  fs.unlink(file.path, function (err) {
      if (err)
      { 
          console.log('failed to delete ' + file.path);
      }
      else{
        console.log('successfully deleted ' + file.path);
      }
  });
  article.image = base64Image;

  article.save(function(err) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        res.json(article);
	    }
	  });
	});
};

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};