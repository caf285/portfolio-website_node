// required
require("dotenv").config({ path: ".env.local" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const apiRoutes = require("./apiRoutes.js");

// set vars
const dev = process.env.NODE_ENV === "development";
const myExpress = express();
const PORT = process.env.PORT || dev ? 3000 : process.env.HOST_PORT;
myExpress.use(bodyParser.json());

// only allow localhost in development
//const whitelist = ["https://caf285.github.io", "https://toolatefortacos.com"];
const whitelist = [process.env.ORIGIN_GIT, process.env.ORIGIN_WEBADDRESS];
if (dev) {whitelist.push("http://localhost:3000")};
myExpress.use(cors({
  origin: whitelist
}));

// get GoDaddy stats
myExpress.use(apiRoutes);

// port listener
myExpress.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
