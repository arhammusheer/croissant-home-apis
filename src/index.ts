import http from "http";
import app from "./app";
import { logger } from "./utils/logger";

const LOG_OWNER = "Server";

const server = http.createServer(app);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  logger.info(LOG_OWNER, `Server running on port ${PORT}`);
});
