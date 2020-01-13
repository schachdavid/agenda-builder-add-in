/**
 * Post CSS config file.
 *
 * @file Config file for Post CSS which is the loader which
 * is used for webpack to process CSS. Configures autoprefixer
 * which is used to add vendor prefixes in the css for webkit, 
 * moz etc. 
 * 
 * @license MIT
 */

module.exports = {
    plugins: [
      require('autoprefixer')
    ]
}