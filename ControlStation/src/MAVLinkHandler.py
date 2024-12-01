from pymavlink import mavutil
from PySide6.QtCore import QObject, Signal, Slot, QThread
import sys


class MAVLinkThread(QThread):
    """Thread for handling MAVLink communication."""

    adc_value_signal = Signal(float)

    def __init__(self, serial_port, baud_rate=115200):
        super().__init__()
        self.serial_port = serial_port
        self.baud_rate = baud_rate
        self.master = None

    def run(self):
        """Start MAVLink listening in a separate thread."""
        # Create a MAVLink connection
        self.master = mavutil.mavlink_connection(self.serial_port, baud=self.baud_rate)
        self.master.wait_heartbeat() 

        # Begin listening for messages
        while True:
            msg = self.master.recv_match(blocking=True)
            if msg is not None:
                self.handle_message(msg)

    def handle_message(self, msg):
        """Handle incoming MAVLink messages."""
        if msg.get_type() == "PARAM_VALUE":
            # Check if the message is the ADC reading
            if msg.param_id == "ADC_READING":
                adc_value = msg.param_value
                # Emit signal to update the QML frontend
                self.adc_value_signal.emit(adc_value)


class MAVLinkHandler(QObject):
    """Main handler for MAVLink connection and managing ADC values."""

    adc_value_signal = Signal(float)

    def __init__(self):
        super().__init__()
        self.mavlink_thread = None

    @Slot(str, int)
    def start_listening(self, serial_port, baud_rate=115200):
        """Start listening for MAVLink messages in a separate thread."""
        if self.mavlink_thread is None:
            self.mavlink_thread = MAVLinkThread(serial_port, baud_rate)
            self.mavlink_thread.adc_value_signal.connect(self.on_adc_value_received)
            self.mavlink_thread.start()

    @Slot(float)
    def on_adc_value_received(self, adc_value):
        """Receive the ADC value from the MAVLink thread."""
        # Here you can do additional processing with the ADC value or forward it to QML
        self.adc_value_signal.emit(adc_value)
