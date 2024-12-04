import sys
import threading
from PyQt5.QtWidgets import QApplication
from serial_handler import SerialHandler
from plot_handler import RealTimePlot
from tri import TriangulationHandler
import time


def read_serial_data(serial_interface, plot, triangulation):
    """Reads data from the serial port and updates the plot."""
    start_time = time.time()  # Reference for relative timestamps
    while True:
        packet = serial_interface.read_json_packet()
        if packet:
            velocity = packet.get("velocity", 0)
            gps_time = packet.get("gps_time", 0)
            latitude = packet.get("latitude", 0)
            longitude = packet.get("longitude", 0)

            # Calculate relative timestamp
            relative_time = time.time() - start_time

            # Print to terminal
            print(f"Velocity: {velocity:.6f} m/s, Relative Time: {relative_time:.2f}s, "
                  f"Latitude: {latitude:.6f}, Longitude: {longitude:.6f}, GPS Time: {gps_time}")

            # Update plot
            plot.add_data(velocity, velocity, velocity, relative_time)

            # Send data for triangulation if it meets the threshold
            triangulation.process_packet(packet)


def main():
    app = QApplication(sys.argv)

    # Initialize SerialHandler
    serial_interface = SerialHandler()
    port = serial_interface.select_port()
    if not port:
        print("No port selected. Exiting.")
        sys.exit()

    serial_interface.connect(port)

    # Initialize and show the real-time plot
    plot = RealTimePlot()

    # Initialize TriangulationHandler with a threshold and dummy offsets
    triangulation = TriangulationHandler(threshold=0.0001, dummy_offsets=[(0.001, 0.001), (0.001, -0.001)])

    # Start a thread for reading serial data
    serial_thread = threading.Thread(target=read_serial_data, args=(serial_interface, plot, triangulation), daemon=True)
    serial_thread.start()

    # Start the PyQt application
    plot.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()