const statsRoutes = require("./routes/statsRoutes");
const StatsController = require("./controllers/StatsController");
const StatsService = require("./services/StatsService");

module.exports = {
  routes: statsRoutes,
  controller: StatsController,
  service: StatsService,
};
