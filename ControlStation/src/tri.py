import json
import math
import time


class TriangulationHandler:
    def __init__(self, threshold, dummy_offsets=None):
        """
        Initialize the TriangulationHandler.
        
        :param threshold: Velocity threshold for triggering triangulation.
        :param dummy_offsets: List of (lat_offset, lon_offset) tuples for dummy sensors.
        """
        self.threshold = threshold
        self.sensor_data = {}  # Stores velocity and GPS time per sensor
        self.dummy_offsets = dummy_offsets or []  # Default to empty if no dummy offsets provided

    def process_packet(self, packet):
        try:
            # Extract data from the packet
            sensor_id = packet.get("sensor_id")
            velocity = packet.get("velocity")
            gps_time = packet.get("gps_time", 0)
            latitude = packet.get("latitude", 0)
            longitude = packet.get("longitude", 0)

            # If GPS time is missing, use system time as a fallback
            if gps_time == 0 and latitude != 0 and longitude != 0:
                gps_time = int(time.time())
                print(f"Missing GPS time for sensor {sensor_id}, using system time: {gps_time}")

            # Only process data if velocity exceeds the threshold
            if velocity is not None and abs(velocity) >= self.threshold:
                self.sensor_data[sensor_id] = {
                    "gps_time": gps_time,
                    "velocity": velocity,
                    "latitude": latitude,
                    "longitude": longitude,
                }

                # Add dummy sensors if configured
                self.add_dummy_sensors(latitude, longitude, gps_time)

                # Perform trilateration when we have data from all sensors
                if len(self.sensor_data) >= 3:
                    self.perform_trilateration()

        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error processing packet: {e}")

    def add_dummy_sensors(self, base_lat, base_lon, gps_time):
        """
        Add dummy sensors based on the configured offsets.
        
        :param base_lat: Latitude of the real sensor.
        :param base_lon: Longitude of the real sensor.
        :param gps_time: GPS time to associate with dummy sensors.
        """
        for i, (lat_offset, lon_offset) in enumerate(self.dummy_offsets, start=1):
            dummy_sensor_id = f"dummy_{i}"
            if dummy_sensor_id not in self.sensor_data:
                self.sensor_data[dummy_sensor_id] = {
                    "gps_time": gps_time,
                    "velocity": self.threshold,  # Assign threshold velocity to dummy sensors
                    "latitude": base_lat + lat_offset,
                    "longitude": base_lon + lon_offset,
                }

    def perform_trilateration(self):
        # Ensure at least three sensors are available
        if len(self.sensor_data) < 3:
            print("Not enough sensors for trilateration.")
            return

        # Log the sensor data being used
        print(f"Sensor Data for Trilateration: {self.sensor_data}")

        sensors = list(self.sensor_data.values())
        lat1, lon1 = sensors[0]["latitude"], sensors[0]["longitude"]
        lat2, lon2 = sensors[1]["latitude"], sensors[1]["longitude"]
        lat3, lon3 = sensors[2]["latitude"], sensors[2]["longitude"]

        print(f"\nTriangulating using sensors at: "
              f"({lat1}, {lon1}), ({lat2}, {lon2}), ({lat3}, {lon3})")

        # Example: Calculate centroid as the estimated source position
        estimated_lat = (lat1 + lat2 + lat3) / 3
        estimated_lon = (lon1 + lon2 + lon3) / 3

        print(f"Source Position (Estimated): Lat {estimated_lat}, Lon {estimated_lon} \n")