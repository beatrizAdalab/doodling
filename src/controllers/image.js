const path = require('path');
const { randomName } = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');

//Models
const { Image, Comment } = require('../models/index');

const helpers = require('../helpers/time');
const sidebars = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} }

  const image_id = req.params.image_id;
  const image = await Image.findOne({ filename: { $regex: image_id } });

  if (image) {
    //update views 
    image.views = image.views + 1;

    viewModel.image = image
    await image.save();

    //comments of image
    const comments = await Comment.find({ image_id: image._id });
    viewModel.comments = comments

    //add sidebar to view
    await sidebars(viewModel);

    res.render('image', { viewModel, helpers });
  } else {
    res.redirect('/')
  }
};

ctrl.create = async (req, res) => {

  const saveImage = async () => {
    const imageUrl = randomName();
    const images = await Image.find({ filename: imageUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const imageTempPath = req.file.path;
      const targetPath = path.resolve(`src/public/upload/${imageUrl}${ext}`);

      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          description: req.body.description,
          filename: imageUrl + ext,
        });
        const imageSave = await newImg.save();
        res.redirect('/images/' + imageUrl);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Incorrect format' });
      }
    }
  };

  saveImage();
};

ctrl.like = async (req, res) => {
  const image_id = req.params.image_id;
  const image = await Image.findOne({ filename: { $regex: image_id } });

  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes })
  } else {
    res.status(500).json({ error: 'Internal error' })
  }
};

ctrl.comment = async (req, res) => {
  const image_id = req.params.image_id;
  const image = await Image.findOne({ filename: { $regex: image_id } });

  if (image) {
    const newComment = new Comment(req.body);
    //gravatar image user
    newComment.gravatar = md5(newComment.email);

    newComment.image_id = image._id;
    await newComment.save();

    res.redirect('/images/' + image.uniqueId);
  }
};

ctrl.remove = async (req, res) => {
  const image_id = req.params.image_id;
  const image = await Image.findOne({ filename: { $regex: image_id } });

  if (image) {
    //remove image in upload
    await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
    //remove comments
    await Comment.deleteOne({ image_id: image._id });
    //remove image
    await image.remove();
    res.json(true)
  }
};

module.exports = ctrl;