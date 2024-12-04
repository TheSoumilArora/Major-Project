import json
import math


class TriangulationHandler:
    def __init__(self, threshold):
        self.threshold = threshold
        self.sensor_data = {}  # Stores velocity and GPS time per sensor

    def process_packet(self, packet):
        try:
            data = json.loads(packet)
            sensor_id = data.get("sensor_id")
            velocity = data.get("velocity")
            gps_time = data.get("gps_time")
            latitude = data.get("latitude")
            longitude = data.get("longitude")

            # Only process data if velocity exceeds the threshold
            if velocity is not None and abs(velocity) >= self.threshold:
                self.sensor_data[sensor_id] = {
                    "gps_time": gps_time,
                    "velocity": velocity,
                    "latitude": latitude,
                    "longitude": longitude,
                }

                # Perform trilateration when we have data from all sensors
                if len(self.sensor_data) >= 3:
                    self.perform_trilateration()

        except json.JSONDecodeError:
            print("Invalid JSON received.")

    def perform_trilateration(self):
        # Example: Trilateration with three sensors
        if len(self.sensor_data) < 3:
            return

        sensors = list(self.sensor_data.values())
        lat1, lon1 = sensors[0]["latitude"], sensors[0]["longitude"]
        lat2, lon2 = sensors[1]["latitude"], sensors[1]["longitude"]
        lat3, lon3 = sensors[2]["latitude"], sensors[2]["longitude"]

        print(f"Triangulating using sensors at: "
              f"({lat1}, {lon1}), ({lat2}, {lon2}), ({lat3}, {lon3})")

        # Simple example: Take the centroid of the three points as the source location
        estimated_lat = (lat1 + lat2 + lat3) / 3
        estimated_lon = (lon1 + lon2 + lon3) / 3

        print(f"Source Position (Estimated): Lat {estimated_lat}, Lon {estimated_lon}")