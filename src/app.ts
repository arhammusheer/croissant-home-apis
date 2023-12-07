import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler, unknownEndpoint } from "./utils/middleware";
import helloRoute from "./routes/helloRouter";
import getBusInfo from "./utils/transit";
import axios from "axios";
import router from "./routes/root.router";

const app = express();

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// Routes
app.use(router);

app.use("/hello", helloRoute);

// custom middleware
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

export const EXAMPLE_BUS = {
  route_departures: [
    {
      global_route_id: "PVTAMA:116200",
      itineraries: [
        {
          branch_code: "",
          direction_headsign: "Sunderland",
          direction_id: 0,
          headsign: "Sunderland",
          merged_headsign: "Sunderland",
          schedule_items: [
            {
              departure_time: 1693255980,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017495-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693255980,
              trip_search_key: "PVTAMA:43094228:5:0:16",
              wheelchair_accessible: 1,
            },
            {
              departure_time: 1693258080,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017523-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693258080,
              trip_search_key: "PVTAMA:43094228:5:0:17",
              wheelchair_accessible: 1,
            },
            {
              departure_time: 1693260180,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017496-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693260180,
              trip_search_key: "PVTAMA:43094228:5:0:18",
              wheelchair_accessible: 1,
            },
          ],
        },
      ],
      mode_name: "Bus",
      real_time_route_id: "20031",
      route_color: "ea6083",
      route_long_name: "Sunderland  /  South Amherst",
      route_network_id: "PVTA|Boston",
      route_network_name: "PVTA",
      route_short_name: "31",
      route_text_color: "ffffff",
      route_type: 3,
      sorting_key: "31",
      tts_long_name: "Sunderland  /  South Amherst",
      tts_short_name: "31",
    },
  ],
};
