import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore
import sys
import threading
import time
from collections import deque
import csv
from serial_interface import SerialInterface


class RealTimePlot(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QuakeSense - Real-Time Data")
        self.resize(900, 700)

        # Create main layout
        self.layout = QtWidgets.QVBoxLayout(self)

        # Create controls layout
        self.controls_layout = QtWidgets.QHBoxLayout()
        self.layout.addLayout(self.controls_layout)

        # Create plot widget
        self.plot_widget = pg.GraphicsLayoutWidget()
        self.layout.addWidget(self.plot_widget)

        # Add plot
        self.plot = self.plot_widget.addPlot(title="Velocity vs Time")
        self.plot.setLabel("left", "Velocity (m/s)")
        self.plot.setLabel("bottom", "Time (s)")
        self.plot.showGrid(x=True, y=True)  # Add grid for better visualization
        self.curve = self.plot.plot(pen='y', name="Velocity")

        # Marker for interactive analysis
        self.marker = pg.InfiniteLine(angle=90, movable=True, pen=pg.mkPen(color='r', style=pg.QtCore.Qt.DashLine))
        self.plot.addItem(self.marker)
        self.marker_label = pg.TextItem(anchor=(1, 1), color="r")
        self.plot.addItem(self.marker_label)

        # Update marker label on movement
        self.marker.sigPositionChanged.connect(self.update_marker_label)

        # Data storage
        self.data = deque(maxlen=200)  # Velocity data (limit to last 200 points)
        self.time_stamps = deque(maxlen=200)  # Timestamps

        # Timer for updating the plot
        self.timer = pg.QtCore.QTimer()
        self.timer.timeout.connect(self.update_plot)
        self.timer.start(50)  # Update every 50ms (20 FPS)

        # Pause and Resume buttons
        self.pause_button = QtWidgets.QPushButton("Pause")
        self.pause_button.clicked.connect(self.pause_plotting)
        self.controls_layout.addWidget(self.pause_button)

        self.resume_button = QtWidgets.QPushButton("Resume")
        self.resume_button.clicked.connect(self.resume_plotting)
        self.controls_layout.addWidget(self.resume_button)

        # Save Data button
        self.save_button = QtWidgets.QPushButton("Save Data")
        self.save_button.clicked.connect(self.save_data)
        self.controls_layout.addWidget(self.save_button)

        # Slider to adjust max points
        self.slider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
        self.slider.setRange(50, 1000)
        self.slider.setValue(200)
        self.slider.setTickInterval(50)
        self.slider.setTickPosition(QtWidgets.QSlider.TicksBelow)
        self.slider.valueChanged.connect(self.adjust_max_points)
        self.controls_layout.addWidget(self.slider)

        # Flags
        self.paused = False

    def add_data(self, velocity, timestamp):
        """Add new data to the plot."""
        if not self.paused:
            self.data.append(velocity)
            self.time_stamps.append(timestamp)

    def update_plot(self):
        """Redraw the plot with the current data."""
        if len(self.time_stamps) > 0:
            self.curve.setData(self.time_stamps, self.data)
            self.plot.setXRange(min(self.time_stamps), max(self.time_stamps), padding=0.1)
            self.plot.setYRange(min(self.data) - 0.1, max(self.data) + 0.1, padding=0.1)

    def update_marker_label(self):
        """Update the label of the marker."""
        marker_pos = self.marker.value()
        self.marker_label.setText(f"Time: {marker_pos:.2f}", color="r")
        self.marker_label.setPos(marker_pos, self.plot.getViewBox().viewRange()[1][1])

    def adjust_max_points(self, value):
        """Adjust the maximum number of points to display."""
        self.data = deque(self.data, maxlen=value)
        self.time_stamps = deque(self.time_stamps, maxlen=value)

    def pause_plotting(self):
        """Pause the real-time plot."""
        self.paused = True

    def resume_plotting(self):
        """Resume the real-time plot."""
        self.paused = False

    def save_data(self):
        """Save the data to a CSV file."""
        file_name, _ = QtWidgets.QFileDialog.getSaveFileName(self, "Save Data", "", "CSV Files (*.csv)")
        if file_name:
            with open(file_name, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["Timestamp", "Velocity"])
                writer.writerows(zip(self.time_stamps, self.data))
            QtWidgets.QMessageBox.information(self, "Save Data", "Data saved successfully!")

    def start(self):
        """Start the PyQt application."""
        self.show()


def read_serial_data(serial_interface, plot):
    """Read data from the serial port and update the plot."""
    while True:
        packet = serial_interface.read_json_packet()
        if packet:
            velocity = packet.get("velocity", 0)
            timestamp = time.time()  # Use current time as timestamp

            print(f"Velocity: {velocity} m/s")
            plot.add_data(velocity, timestamp)


def main():
    # Initialize Serial Interface
    serial_interface = SerialInterface()
    port = serial_interface.select_port()
    if not port:
        return

    try:
        serial_interface.connect(port)
        app = QtWidgets.QApplication(sys.argv)
        plot = RealTimePlot()

        # Start a thread for reading serial data
        thread = threading.Thread(target=read_serial_data, args=(serial_interface, plot), daemon=True)
        thread.start()

        # Start the PyQt application
        plot.start()
        sys.exit(app.exec_())
    except KeyboardInterrupt:
        print("\nExiting program.")
    finally:
        serial_interface.disconnect()


if __name__ == "__main__":
    main()