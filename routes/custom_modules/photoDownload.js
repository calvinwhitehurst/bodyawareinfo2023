const download = require("image-downloader");

module.exports = function photoDownload(url, fileNumber) {
  var options = {
    url: url,
    dest: "/home/calvin/public/img/" + fileNumber + "-L.jpg",
  };
  download
    .image(options)
    .then(({ filename }) => {
      console.log("Saved to", __dirname + filename); // saved to /path/to/dest/photo.jpg
    })
    .catch((err) => console.error(err));
};
