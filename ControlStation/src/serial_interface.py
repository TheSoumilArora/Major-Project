import serial
import serial.tools.list_ports
import json


class SerialInterface:
    def __init__(self, baudrate=115200):
        self.baudrate = baudrate
        self.ser = None

    @staticmethod
    def get_serial_ports():
        """List all available serial ports."""
        ports = serial.tools.list_ports.comports()
        return [port.device for port in ports]

    def select_port(self):
        """CLI for selecting a serial port."""
        ports = self.get_serial_ports()
        if not ports:
            print("No serial ports detected!")
            return None

        print("Available Ports:")
        for i, port in enumerate(ports):
            print(f"{i}: {port}")

        try:
            selected_index = int(input("Select Port Number: "))
            if selected_index < 0 or selected_index >= len(ports):
                print("Invalid selection.")
                return None
            return ports[selected_index]
        except ValueError:
            print("Invalid input. Please enter a valid number.")
            return None

    def connect(self, port):
        """Connect to the selected serial port."""
        try:
            self.ser = serial.Serial(port, self.baudrate, timeout=1)
            print(f"Connected to {port} at {self.baudrate} baud.")
        except serial.SerialException as e:
            print(f"Error: Unable to open port {port}. {str(e)}")
            raise e

    def read_json_packet(self):
        """Read and parse JSON packets from the serial port."""
        try:
            raw_data = self.ser.read_until(b'>').decode('utf-8').strip()
            if not raw_data.startswith('<') or not raw_data.endswith('>'):
                print("Invalid framing. Skipping packet.")
                return None

            json_data = raw_data[1:-1]  # Remove delimiters
            return json.loads(json_data)
        except json.JSONDecodeError:
            print("Invalid JSON received.")
            return None
        except Exception as e:
            print(f"Error reading JSON packet: {str(e)}")
            return None

    def disconnect(self):
        """Close the serial connection."""
        if self.ser:
            self.ser.close()
            print("Disconnected from serial port.")