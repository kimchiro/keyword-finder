const keywordRoutes = require("./routes/keywordRoutes");
const KeywordController = require("./controllers/KeywordController");
const KeywordService = require("./services/KeywordService");
const KeywordDao = require("./dao/KeywordDao");

module.exports = {
  routes: keywordRoutes,
  controller: KeywordController,
  service: KeywordService,
  dao: KeywordDao,
};
