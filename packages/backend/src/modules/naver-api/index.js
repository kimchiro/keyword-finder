const naverApiRoutes = require("./routes/naverApiRoutes");
const NaverApiController = require("./controllers/NaverApiController");
const NaverApiService = require("./services/NaverApiService");
const NaverApiDao = require("./dao/NaverApiDao");

module.exports = {
  routes: naverApiRoutes,
  controller: NaverApiController,
  service: NaverApiService,
  dao: NaverApiDao,
};
