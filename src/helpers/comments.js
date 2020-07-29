'use strict'

const { Image, Comment } = require('../models');

module.exports = {
  async newest() {
    const comments = await Comment.find()
      .limit(5)
      .sort({ timestamp: -1 })

    //get image of each comment
    for (const comment of comments) {
      const image = await Image.findOne({ _id: comment.image_id })
      comment.image = image;
    }

    return comments
  }
}