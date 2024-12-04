import serial
import serial.tools.list_ports
import json


class SerialHandler:
    def __init__(self):
        self.serial_port = None

    def select_port(self):
        """Lists available ports and selects one."""
        ports = serial.tools.list_ports.comports()
        available_ports = [port.device for port in ports]

        if not available_ports:
            print("No serial ports detected.")
            return None

        print("Available Ports:")
        for i, port in enumerate(available_ports):
            print(f"{i}: {port}")

        try:
            selected_index = int(input("Select Port Number: "))
            return available_ports[selected_index]
        except (ValueError, IndexError):
            print("Invalid selection.")
            return None

    def connect(self, port):
        """Connects to the serial port."""
        try:
            self.serial_port = serial.Serial(port, 115200, timeout=1)
            print(f"Connected to {port}.")
        except serial.SerialException as e:
            print(f"Error connecting to {port}: {e}")
            self.serial_port = None

    def disconnect(self):
        """Disconnects the serial port."""
        if self.serial_port:
            self.serial_port.close()
            print("Serial port disconnected.")

    def read_json_packet(self):
        """Reads a JSON packet with framing (~)."""
        try:
            if self.serial_port:
                line = self.serial_port.read_until(b'~').decode("utf-8").strip("~")
                if line:
                    return json.loads(line)
        except json.JSONDecodeError:
            print("Invalid JSON received.")
        except Exception as e:
            print(f"Error reading data: {e}")
        return None