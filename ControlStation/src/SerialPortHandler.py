from PySide6.QtCore import QObject, Signal, Slot
from PySide6.QtSerialPort import QSerialPort, QSerialPortInfo


class SerialPortHandler(QObject):
    availablePortsSignal = Signal(list)

    def __init__(self):
        super().__init__()
        self.ports = []

    @Slot()
    def list_serial_ports(self):
        """List all available serial ports"""
        self.ports = [port.systemLocation() for port in QSerialPortInfo.availablePorts()]
        self.availablePortsSignal.emit(self.ports)


if __name__ == "__main__":
    ports = QSerialPortInfo.availablePorts()

    handler = SerialPortHandler()
    handler.list_serial_ports()

    for port in handler.ports:
        print(port)
