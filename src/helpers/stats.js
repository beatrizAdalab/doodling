'use string'

const { Image, Comment } = require('../models');

async function imagesCounter() {
  return await Image.countDocuments();
};

async function commentsCounter() {
  return await Comment.countDocuments();
}

async function imagesTotalViewsCounter() {
  const result = await Image.aggregate([{
    $group: {
      _id: '1',
      viewsTotal: { $sum: '$views' }
    }
  }]);
  return result[0].viewsTotal;
};

async function likesTotalCounter() {

  const result = await Image.aggregate([{
    $group: {
      _id: '1',
      likesTotal: { $sum: '$likes' }
    }
  }]);

  return result[0].likesTotal;
}


module.exports = async () => {
  const results = await Promise.all([
    imagesCounter(),
    commentsCounter(),
    imagesTotalViewsCounter(),
    likesTotalCounter()
  ]);

  return {
    totalImages: results[0],
    totalComments: results[1],
    totalViews: results[2],
    totalLikes: results[3]
  };
}