import sys
import threading
from PyQt5.QtWidgets import QApplication
from serial_handler import SerialHandler
from plot_handler import RealTimePlot


def read_serial_data(serial_interface, plot):
    """Reads data from the serial port and updates the plot."""
    while True:
        packet = serial_interface.read_json_packet()
        if packet:
            velocity = packet.get("velocity", 0)
            gps_time = packet.get("timestamp", 0)
            latitude = packet.get("latitude", 0)
            longitude = packet.get("longitude", 0)

            # Print to terminal
            print(f"Velocity: {velocity:.6f} m/s, Latitude: {latitude:.6f}, Longitude: {longitude:.6f}, GPS Time: {gps_time}")

            # Update plot
            plot.add_data(velocity, velocity, velocity, gps_time)


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

    # Start a thread for reading serial data
    serial_thread = threading.Thread(target=read_serial_data, args=(serial_interface, plot), daemon=True)
    serial_thread.start()

    # Start the PyQt application
    plot.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()