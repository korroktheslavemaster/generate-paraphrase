const express = require("express");
const app = express();
const path = require("path");
app.use(express.static("public"));
app.set("port", process.env.PORT || 3001);

// after api and auth routes so that doesn't mess with them?
if (process.env.NODE_ENV == "production") {
    console.log("prod env");
    app.use(express.static(path.join(__dirname, "client/build")));
  
    app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
  }
  
  app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
  });
  
  // for use in testing
  module.exports = app;