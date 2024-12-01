import sys
import random
import os
import serial.tools.list_ports  # For listing available serial ports
from PySide6.QtCore import Qt, QObject, Signal, QTimer
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtWidgets import QApplication

# Simulated ADC Handler (instead of MAVLink)
class ADCHandler(QObject):
    # Signal to send ADC value to the QML frontend
    adc_value_signal = Signal(float)

    def __init__(self):
        super().__init__()
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.generate_adc_value)
        self.timer.start(100)  # Simulate ADC reading every 100 ms

    def generate_adc_value(self):
        """Generate a random ADC value and emit the signal"""
        adc_value = random.randint(0, 4095)  # Simulating a 12-bit ADC value
        self.adc_value_signal.emit(adc_value)


class SerialPortHandler(QObject):
    # Signal to notify about available ports
    available_ports_signal = Signal(list)
    # Signal to notify connection status
    connection_status_signal = Signal(str)

    def __init__(self):
        super().__init__()
        self.ports = []

    def list_serial_ports(self):
        """List all available serial ports"""
        self.ports = [port.device for port in serial.tools.list_ports.comports()]
        self.available_ports_signal.emit(self.ports)

    def connect_to_port(self, port):
        """Simulate connecting to the selected serial port"""
        if port in self.ports:
            self.connection_status_signal.emit(f"Connected to {port}")
        else:
            self.connection_status_signal.emit("Failed to connect")


def main():
    app = QApplication(sys.argv)

    # Set up the simulated ADC handler
    adc_handler = ADCHandler()

    # Set up the serial port handler
    serial_port_handler = SerialPortHandler()
    print(serial_port_handler.list_serial_ports())

    # Start the QML engine
    engine = QQmlApplicationEngine()

    # Expose the handlers to the QML context
    engine.rootContext().setContextProperty("adcHandler", adc_handler)
    engine.rootContext().setContextProperty("serialPortHandler", serial_port_handler)

    # Get the current directory of the script and load the QML UI
    script_dir = os.path.dirname(os.path.abspath(__file__))
    engine.load(os.path.join(script_dir, "main.qml"))

    if not engine.rootObjects():
        sys.exit(-1)

    sys.exit(app.exec())

if __name__ == "__main__":
    main()
