import sys
import threading
import time
from serial_handler import SerialHandler
import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets
from collections import deque

class RealTimePlot(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QuakeSense - Real-Time Data")
        self.resize(900, 700)

        # Create layout
        self.layout = QtWidgets.QVBoxLayout(self)

        # Create plot widget
        self.plot_widget = pg.GraphicsLayoutWidget()
        self.layout.addWidget(self.plot_widget)

        # Create three plots for three sensors
        self.plots = []
        self.curves = []
        self.data = [deque(maxlen=200) for _ in range(3)]  # Store velocity data
        self.timestamps = deque(maxlen=200)  # Store timestamps

        for i in range(3):
            plot = self.plot_widget.addPlot(title=f"Sensor {i + 1} Velocity")
            plot.setLabel("left", "Velocity (m/s)")
            plot.setLabel("bottom", "GPS Time (s)")
            plot.showGrid(x=True, y=True)  # Add grid for better visualization
            curve = plot.plot(pen='y', name=f"Sensor {i + 1}")
            self.plots.append(plot)
            self.curves.append(curve)

            # Add spacing between plots
            if i < 2:
                self.plot_widget.nextRow()

        # Timer for updating the plot
        self.timer = pg.QtCore.QTimer()
        self.timer.timeout.connect(self.update_plot)
        self.timer.start(50)  # Update every 50ms (20 FPS)

    def add_data(self, velocities, timestamp):
        """Add new data for all three sensors."""
        self.timestamps.append(timestamp)
        for i in range(3):
            self.data[i].append(velocities[i])

    def update_plot(self):
        """Redraw the plots with the current data."""
        if len(self.timestamps) > 0:
            for i in range(3):
                self.curves[i].setData(self.timestamps, self.data[i])
                # Auto-scale the x-axis and y-axis to fit the data
                self.plots[i].setXRange(min(self.timestamps), max(self.timestamps), padding=0.1)
                self.plots[i].setYRange(min(self.data[i]) - 0.1, max(self.data[i]) + 0.1, padding=0.1)

    def start(self):
        """Start the PyQt application."""
        self.show()


def read_serial_data(serial_handler, plot):
    """Read data from the serial port and update the plot."""
    while True:
        packet = serial_handler.read_json_packet()
        if packet:
            velocity = packet.get("velocity", 0)
            gps_time = packet.get("timestamp", time.time())
            print(f"Sensor 1 Velocity: {velocity} m/s, GPS Time: {gps_time}")
            plot.add_data([velocity, velocity, velocity], gps_time)  # Add dummy data for two other sensors


def main():
    # Initialize Serial Interface
    serial_handler = SerialHandler()
    ports = serial_handler.get_serial_ports()
    if not ports:
        print("No serial ports detected.")
        return

    print("Available Ports:")
    for i, port in enumerate(ports):
        print(f"{i}: {port}")

    try:
        selected_index = int(input("Select port number: "))
        if selected_index < 0 or selected_index >= len(ports):
            print("Invalid selection.")
            return
        port = ports[selected_index]
    except ValueError:
        print("Invalid input. Please enter a valid number.")
        return

    serial_handler.connect(port)

    try:
        app = QtWidgets.QApplication(sys.argv)
        plot = RealTimePlot()

        # Start a thread for reading serial data
        thread = threading.Thread(target=read_serial_data, args=(serial_handler, plot), daemon=True)
        thread.start()

        # Start the PyQt application
        plot.start()
        sys.exit(app.exec_())
    except KeyboardInterrupt:
        print("\nExiting program.")
    finally:
        serial_handler.disconnect()


if __name__ == "__main__":
    main()