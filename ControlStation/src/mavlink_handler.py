from pymavlink import mavutil
from PySide6.QtCore import QObject, Signal

class MAVLinkHandler(QObject):
    # Signal to send ADC value to the QML frontend
    adc_value_signal = Signal(float)

    def __init__(self, serial_port, baud_rate=115200):
        super().__init__()
        # Create a MAVLink connection
        self.master = mavutil.mavlink_connection(serial_port, baud=baud_rate)
        self.adc_values = []  # List to store ADC values

    def start_listening(self):
        """Start listening for MAVLink messages."""
        # Wait for heartbeat to establish connection
        self.master.wait_heartbeat()
        print("MAVLink heartbeat received")
        
        # Begin listening for messages
        while True:
            msg = self.master.recv_match(blocking=True)
            if msg is not None:
                self.handle_message(msg)

    def handle_message(self, msg):
        """Handle incoming MAVLink messages."""
        if msg.get_type() == 'PARAM_VALUE':
            # Check if the message is the ADC reading
            if msg.param_id == b"ADC_READING":
                adc_value = msg.param_value
                print(f"Received ADC value: {adc_value}")
                self.adc_values.append(adc_value)
                # Emit signal to update the QML frontend
                self.adc_value_signal.emit(adc_value)
