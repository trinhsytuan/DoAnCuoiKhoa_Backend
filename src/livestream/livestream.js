const NodeMediaServer = require("node-media-server");

function createLiveStream(key) {
  const config = {
    rtmp: {
      port: 8081,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      allow_origin: "*",
    },
    auth: {
      play: true,
      publish: true,
      secret: key,
    },
  };

  var nms = new NodeMediaServer(config);
  nms.run();
}
module.exports = { createLiveStream };
