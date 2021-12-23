const cloudinary = require('cloudinary').v2;
require('dotenv').config();

module.exports = {
  getDetails: (req, res) => {
    res.json({
      cloudName: process.env.MEDIA_STORAGE_NAME,
      apiKey: process.env.MEDIA_STORAGE_KEY,
    });
  },

  signRequest: (req, res) => res.json({
    signature: cloudinary.utils.api_sign_request(req.body, process.env.MEDIA_STORAGE_SECRET)
  }),
};
