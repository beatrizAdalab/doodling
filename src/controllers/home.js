const { Image } = require('../models');
const sidebars = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { images: [] }

  const images = await Image.find().sort({ timestamp: -1 });

  viewModel.images = images;
  viewModel = await sidebars(viewModel);

  res.render('index', { viewModel })
};


module.exports = ctrl;