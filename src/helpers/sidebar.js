'use strict'

const Stats = require('./stats');
const Images = require('./images');
const Comments = require('./comments');



module.exports = async (viewModel) => {

  const results = await Promise.all([
    Stats(),
    Images.popular(),
    Comments.newest()
  ])

  viewModel.sidebar = {
    stats: results[0],
    popularImgs: results[1],
    lastComments: results[2],
  }

  return viewModel;
}