const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: {
        protocol: "https:", // this is required
        //host: "localhost", //"192.168.0.101",
        //hostname: "localhost", //"192.168.0.101", // this.is optional
          host: "rpdev.3key.company",
          hostname: "rpdev.3key.company",
        port: 443,
        path: "/",
        pathRewrite: function (path, req) {
          return path.replace("/api", "");
        },
        cert: fs.readFileSync(__dirname + "/gateway_client_cert.pem", "utf8"),
        key: fs.readFileSync(__dirname + "/gateway_client_key.pem", "utf8"),
      },
      changeOrigin: true,
      secure: false,
    })
  );
};