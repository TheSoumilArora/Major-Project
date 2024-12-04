import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore
from collections import deque


class RealTimePlot(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QuakeSense - Real-Time Data")
        self.resize(900, 700)

        # Layouts
        self.layout = QtWidgets.QVBoxLayout(self)

        # Add slider for deque size adjustment
        self.slider_layout = QtWidgets.QHBoxLayout()
        self.slider_label = QtWidgets.QLabel("Deque Size:")
        self.slider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
        self.slider.setMinimum(50)
        self.slider.setMaximum(500)
        self.slider.setValue(200)
        self.slider.setTickInterval(50)
        self.slider.setTickPosition(QtWidgets.QSlider.TicksBelow)

        self.slider_layout.addWidget(self.slider_label)
        self.slider_layout.addWidget(self.slider)
        self.layout.addLayout(self.slider_layout)

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
        self.data1 = deque(maxlen=self.slider.value())
        self.data2 = deque(maxlen=self.slider.value())
        self.data3 = deque(maxlen=self.slider.value())
        self.timestamps = deque(maxlen=self.slider.value())
        self.timestamps = sorted(self.timestamps)

        # Connect slider to update deque size dynamically
        self.slider.valueChanged.connect(self.update_deque_size)

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

    def update_deque_size(self):
        """Updates the deque size dynamically based on the slider."""
        maxlen = self.slider.value()
        self.data1 = deque(self.data1, maxlen=maxlen)
        self.data2 = deque(self.data2, maxlen=maxlen)
        self.data3 = deque(self.data3, maxlen=maxlen)
        self.timestamps = deque(self.timestamps, maxlen=maxlen)

    def update_plot(self):
        """Updates the plots and dynamically adjusts the x-axis."""
        if len(self.timestamps) > 0:
            # Update the data for all three plots
            self.curve1.setData(self.timestamps, self.data1)
            self.curve2.setData(self.timestamps, self.data2)
            self.curve3.setData(self.timestamps, self.data3)

            # Dynamically adjust the x-axis range
            xmin = self.timestamps[0]  # Oldest timestamp
            xmax = self.timestamps[-1]  # Most recent timestamp
            self.plot1.setXRange(xmin, xmax, padding=0)
            self.plot2.setXRange(xmin, xmax, padding=0)
            self.plot3.setXRange(xmin, xmax, padding=0)