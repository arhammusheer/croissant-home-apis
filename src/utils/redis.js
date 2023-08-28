import { createClient } from "redis";

let client = null;

const init = async () => {
  if (client !== null) {
    return client;
  }
	

  client = createClient({
   url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.log("Redis Error " + err);
  });

	await client.connect();

  return client;
};

export default init;
