import serial
import serial.tools.list_ports
import json

START_BYTE = 0x7E  # Frame start and end byte


class SerialHandler:
    def __init__(self):
        self.ser = None

    def get_serial_ports(self):
        """List all available serial ports."""
        ports = serial.tools.list_ports.comports()
        return [port.device for port in ports]

    def connect(self, port, baud_rate=115200):
        """Connect to the selected serial port."""
        try:
            self.ser = serial.Serial(port, baud_rate, timeout=1)
            print(f"Connected to {port} at {baud_rate} baud.")
        except serial.SerialException as e:
            print(f"Error connecting to {port}: {str(e)}")
            self.ser = None

    def disconnect(self):
        """Disconnect from the serial port."""
        if self.ser:
            self.ser.close()
            print("Disconnected from the serial port.")
            self.ser = None

    def read_json_packet(self):
        """
        Read a framed JSON packet from the serial port.
        The frame is enclosed between two `0x7E` bytes.
        """
        if not self.ser:
            print("Serial port not connected.")
            return None

        try:
            # Read until the start byte is detected
            while True:
                start_byte = self.ser.read(1)
                if start_byte and ord(start_byte) == START_BYTE:
                    break

            # Buffer to store the incoming JSON data
            buffer = b""

            # Read data until the end byte is detected
            while True:
                byte = self.ser.read(1)
                if byte and ord(byte) == START_BYTE:  # End byte detected
                    break
                buffer += byte

            # Decode the buffer as JSON
            try:
                json_data = json.loads(buffer.decode('utf-8'))
                return json_data
            except json.JSONDecodeError:
                print("Invalid JSON received.")
                return None

        except serial.SerialException as e:
            print(f"Serial read error: {str(e)}")
            return None