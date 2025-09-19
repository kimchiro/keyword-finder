const scrapingRoutes = require("./routes/scrapingRoutes");
const ScrapingController = require("./controllers/ScrapingController");
const ScrapingService = require("./services/ScrapingService");
const ScrapingDao = require("./dao/ScrapingDao");

module.exports = {
  routes: scrapingRoutes,
  controller: ScrapingController,
  service: ScrapingService,
  dao: ScrapingDao,
};
