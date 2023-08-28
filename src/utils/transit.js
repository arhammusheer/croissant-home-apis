import axios from "axios";

const getBusInfo = async () => {
  return await axios
    .get("https://external.transitapp.com/v3/public/stop_departures", {
      params: {
        global_stop_id: "PVTAMA:23184",
      },
      headers: {
        apiKey: process.env.TRANSIT_API_KEY,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export default getBusInfo;
