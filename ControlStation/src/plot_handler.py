import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore


class RealTimePlot(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QuakeSense - Real-Time Data")
        self.resize(900, 700)

        # Layouts
        self.layout = QtWidgets.QVBoxLayout(self)

        # Plot Widget
        self.plot_widget = pg.GraphicsLayoutWidget()
        self.layout.addWidget(self.plot_widget)

        # Create 3 plots for 3 sensors (stacked vertically)
        self.plot1 = self.plot_widget.addPlot(row=0, col=0, title="Sensor 1 Velocity")
        self.curve1 = self.plot1.plot(pen='y')
        self.plot2 = self.plot_widget.addPlot(row=1, col=0, title="Sensor 2 Velocity")
        self.curve2 = self.plot2.plot(pen='g')
        self.plot3 = self.plot_widget.addPlot(row=2, col=0, title="Sensor 3 Velocity")
        self.curve3 = self.plot3.plot(pen='b')

        # Data storage
        self.data1 = []
        self.data2 = []
        self.data3 = []
        self.timestamps = []

        # Timer for updating the plot
        self.timer = pg.QtCore.QTimer()
        self.timer.timeout.connect(self.update_plot)
        self.timer.start(50)  # Refresh every 50 ms

    def add_data(self, v1, v2, v3, timestamp):
        """Adds new data to the plot."""
        self.data1.append(v1)
        self.data2.append(v2)
        self.data3.append(v3)
        self.timestamps.append(timestamp)

    def update_plot(self):
        """Updates the plots and dynamically adjusts the x-axis."""
        if len(self.timestamps) > 0:
            # Update the data for all three plots
            self.curve1.setData(self.timestamps, self.data1)
            self.curve2.setData(self.timestamps, self.data2)
            self.curve3.setData(self.timestamps, self.data3)

            # Dynamically adjust the x-axis range
            xmin = min(self.timestamps)  # Oldest timestamp
            xmax = max(self.timestamps)  # Most recent timestamp
            self.plot1.setXRange(xmin, xmax, padding=0)
            self.plot2.setXRange(xmin, xmax, padding=0)
            self.plot3.setXRange(xmin, xmax, padding=0)