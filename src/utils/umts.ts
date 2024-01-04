import axios from "axios";

const stop_ids = {
  30: 120,
  31: 157,
};

/**
 * Get the URL for the bus number
 * @param bus_number 30 or 31
 * @returns
 */
const busURL = (bus_number: 30 | 31) =>
  `https://bustracker.pvta.com/InfoPoint/rest/StopDepartures/get/${stop_ids[bus_number]}`;

const getEDTFromUMTS = async (bus_number: 30 | 31) => {
  // Stop ID
  const stop = stop_ids[bus_number];

  // URL to get data from for stop
  const url = busURL(bus_number);

  // Get data from URL
  const network_response = await axios.get(url);

  // If the status is not 200, return an empty array
  if (network_response.status !== 200) {
    return [];
  }

  // 
  if (!network_response.data.length) {
    return [];
  }

  const data = network_response.data as typeof EXAMPLE_DATA;

  const departures = data.find((d) => d.StopId === stop);

  if (!departures || !departures.RouteDirections[0].Departures) {
    return [];
  }

  const response = departures.RouteDirections[0].Departures.map((d) => ({
    edt: d.EDTLocalTime,
    trip_headsign: d.Trip.InternalSignDesc,
    trip_direction: d.Trip.TripDirection,
  }));

  return response;
};

export default getEDTFromUMTS;

const EXAMPLE_DATA = [
  {
    LastUpdated: "/Date(1701981001710-0500)/",
    RouteDirections: [
      {
        Departures: [
          {
            ADT: null,
            ADTLocalTime: null,
            ATA: null,
            ATALocalTime: null,
            Bay: null,
            Dev: "00:00:00",
            EDT: "/Date(1701981600000-0500)/",
            EDTLocalTime: "2023-12-07T15:40:00",
            ETA: "/Date(1701981056000-0500)/",
            ETALocalTime: "2023-12-07T15:30:56",
            IsCompleted: false,
            IsLastStopOnTrip: false,
            LastUpdated: "/Date(1701980989150-0500)/",
            LastUpdatedLocalTime: "2023-12-07T15:29:49",
            Mode: 0,
            ModeReportLabel: "Normal",
            PropogationStatus: 0,
            SDT: "/Date(1701981600000-0500)/",
            SDTLocalTime: "2023-12-07T15:40:00",
            STA: "/Date(1701981120000-0500)/",
            STALocalTime: "2023-12-07T15:32:00",
            StopFlag: 0,
            StopStatus: 0,
            StopStatusReportLabel: "Scheduled",
            Trip: {
              BlockFareboxId: 314,
              GtfsTripId: "t604-b13A-slBB",
              InternalSignDesc: "Sunderland - No Crestview",
              InternetServiceDesc: "Sunderland - No Crestview",
              IVRServiceDesc: "Sunderland - No Crestview",
              StopSequence: 0,
              TripDirection: "N",
              TripId: 1540,
              TripRecordId: 293193,
              TripStartTime: "/Date(-2208914400000-0500)/",
              TripStartTimeLocalTime: "1900-01-01T15:40:00",
              TripStatus: 0,
              TripStatusReportLabel: "Scheduled",
            },
            PropertyName: "UMASS",
          },
          {
            ADT: null,
            ADTLocalTime: null,
            ATA: null,
            ATALocalTime: null,
            Bay: null,
            Dev: "00:00:00",
            EDT: "/Date(1701982800000-0500)/",
            EDTLocalTime: "2023-12-07T16:00:00",
            ETA: "/Date(1701982758000-0500)/",
            ETALocalTime: "2023-12-07T15:59:18",
            IsCompleted: false,
            IsLastStopOnTrip: false,
            LastUpdated: "/Date(1701981001710-0500)/",
            LastUpdatedLocalTime: "2023-12-07T15:30:01",
            Mode: 0,
            ModeReportLabel: "Normal",
            PropogationStatus: 0,
            SDT: "/Date(1701982800000-0500)/",
            SDTLocalTime: "2023-12-07T16:00:00",
            STA: "/Date(1701982320000-0500)/",
            STALocalTime: "2023-12-07T15:52:00",
            StopFlag: 0,
            StopStatus: 0,
            StopStatusReportLabel: "Scheduled",
            Trip: {
              BlockFareboxId: 311,
              GtfsTripId: "t640-b137-slBB",
              InternalSignDesc: "Sunderland - No Crestview",
              InternetServiceDesc: "Sunderland - No Crestview",
              IVRServiceDesc: "Sunderland - No Crestview",
              StopSequence: 0,
              TripDirection: "N",
              TripId: 1600,
              TripRecordId: 293853,
              TripStartTime: "/Date(-2208913200000-0500)/",
              TripStartTimeLocalTime: "1900-01-01T16:00:00",
              TripStatus: 0,
              TripStatusReportLabel: "Scheduled",
            },
            PropertyName: "UMASS",
          },
          {
            ADT: null,
            ADTLocalTime: null,
            ATA: null,
            ATALocalTime: null,
            Bay: null,
            Dev: "00:00:00",
            EDT: "/Date(1701984000000-0500)/",
            EDTLocalTime: "2023-12-07T16:20:00",
            ETA: "/Date(1701983713000-0500)/",
            ETALocalTime: "2023-12-07T16:15:13",
            IsCompleted: false,
            IsLastStopOnTrip: false,
            LastUpdated: "/Date(1701980969100-0500)/",
            LastUpdatedLocalTime: "2023-12-07T15:29:29",
            Mode: 0,
            ModeReportLabel: "Normal",
            PropogationStatus: 0,
            SDT: "/Date(1701984000000-0500)/",
            SDTLocalTime: "2023-12-07T16:20:00",
            STA: "/Date(1701983520000-0500)/",
            STALocalTime: "2023-12-07T16:12:00",
            StopFlag: 0,
            StopStatus: 0,
            StopStatusReportLabel: "Scheduled",
            Trip: {
              BlockFareboxId: 312,
              GtfsTripId: "t654-b138-slBB",
              InternalSignDesc: "Sunderland - No Crestview",
              InternetServiceDesc: "Sunderland - No Crestview",
              IVRServiceDesc: "Sunderland - No Crestview",
              StopSequence: 0,
              TripDirection: "N",
              TripId: 1620,
              TripRecordId: 293197,
              TripStartTime: "/Date(-2208912000000-0500)/",
              TripStartTimeLocalTime: "1900-01-01T16:20:00",
              TripStatus: 0,
              TripStatusReportLabel: "Scheduled",
            },
            PropertyName: "UMASS",
          },
          {
            ADT: null,
            ADTLocalTime: null,
            ATA: null,
            ATALocalTime: null,
            Bay: null,
            Dev: "00:00:00",
            EDT: "/Date(1701985200000-0500)/",
            EDTLocalTime: "2023-12-07T16:40:00",
            ETA: "/Date(1701984720000-0500)/",
            ETALocalTime: "2023-12-07T16:32:00",
            IsCompleted: false,
            IsLastStopOnTrip: false,
            LastUpdated: "/Date(1701980843047-0500)/",
            LastUpdatedLocalTime: "2023-12-07T15:27:23",
            Mode: 0,
            ModeReportLabel: "Normal",
            PropogationStatus: 0,
            SDT: "/Date(1701985200000-0500)/",
            SDTLocalTime: "2023-12-07T16:40:00",
            STA: "/Date(1701984720000-0500)/",
            STALocalTime: "2023-12-07T16:32:00",
            StopFlag: 0,
            StopStatus: 0,
            StopStatusReportLabel: "Scheduled",
            Trip: {
              BlockFareboxId: 313,
              GtfsTripId: "t668-b139-slBB",
              InternalSignDesc: "Sunderland - No Crestview",
              InternetServiceDesc: "Sunderland - No Crestview",
              IVRServiceDesc: "Sunderland - No Crestview",
              StopSequence: 0,
              TripDirection: "N",
              TripId: 1640,
              TripRecordId: 293200,
              TripStartTime: "/Date(-2208910800000-0500)/",
              TripStartTimeLocalTime: "1900-01-01T16:40:00",
              TripStatus: 0,
              TripStatusReportLabel: "Scheduled",
            },
            PropertyName: "UMASS",
          },
          {
            ADT: null,
            ADTLocalTime: null,
            ATA: null,
            ATALocalTime: null,
            Bay: null,
            Dev: "00:00:00",
            EDT: "/Date(1701986400000-0500)/",
            EDTLocalTime: "2023-12-07T17:00:00",
            ETA: "/Date(1701985920000-0500)/",
            ETALocalTime: "2023-12-07T16:52:00",
            IsCompleted: false,
            IsLastStopOnTrip: false,
            LastUpdated: "/Date(1701980989150-0500)/",
            LastUpdatedLocalTime: "2023-12-07T15:29:49",
            Mode: 0,
            ModeReportLabel: "Normal",
            PropogationStatus: 0,
            SDT: "/Date(1701986400000-0500)/",
            SDTLocalTime: "2023-12-07T17:00:00",
            STA: "/Date(1701985920000-0500)/",
            STALocalTime: "2023-12-07T16:52:00",
            StopFlag: 0,
            StopStatus: 0,
            StopStatusReportLabel: "Scheduled",
            Trip: {
              BlockFareboxId: 314,
              GtfsTripId: "t6A4-b13A-slBB",
              InternalSignDesc:
                "Whately Park & Ride via Sunderland - No Crestview",
              InternetServiceDesc:
                "Whately Park & Ride via Sunderland - No Crestview",
              IVRServiceDesc:
                "Whately Park & Ride via Sunderland - No Crestview",
              StopSequence: 0,
              TripDirection: "N",
              TripId: 1700,
              TripRecordId: 293201,
              TripStartTime: "/Date(-2208909600000-0500)/",
              TripStartTimeLocalTime: "1900-01-01T17:00:00",
              TripStatus: 0,
              TripStatusReportLabel: "Scheduled",
            },
            PropertyName: "UMASS",
          },
        ],
        Direction: "Northbound",
        DirectionCode: "N",
        HeadwayDepartures: null,
        IsDone: false,
        IsHeadway: false,
        IsHeadwayMonitored: false,
        RouteId: 20031,
        RouteRecordId: 707,
      },
      {
        Departures: [],
        Direction: "Southbound",
        DirectionCode: "S",
        HeadwayDepartures: null,
        IsDone: false,
        IsHeadway: false,
        IsHeadwayMonitored: false,
        RouteId: 20031,
        RouteRecordId: 707,
      },
    ],
    StopId: 157,
    StopRecordId: 2328,
  },
];
