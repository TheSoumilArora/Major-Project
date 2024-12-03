import serial
import struct
import time
import serial.tools.list_ports
import tkinter as tk
from tkinter import ttk

# Function to get all available serial ports
def get_serial_ports():
    ports = serial.tools.list_ports.comports()
    return [port.device for port in ports]

def validate_crc(packet_data):
    crc = packet_data[-1]  # Last byte is the CRC
    computed_crc = 0
    for byte in packet_data[:-1]:  # Exclude the CRC byte
        computed_crc ^= byte
    return crc == computed_crc

# Function to read the custom packet and validate CRC
def read_packet(ser):
    data = ser.read(PACKET_SIZE)  # Read the full packet + CRC
    if len(data) == PACKET_SIZE and validate_crc(data):
        sensor_id, timestamp, latitude, longitude, velocity = struct.unpack(PACKET_FORMAT, data[:-1])
        return {
            "sensor_id": sensor_id,
            "timestamp": timestamp,
            "latitude": latitude,
            "longitude": longitude,
            "velocity": velocity
        }
    return None

# Define the packet format (sensor_id, timestamp, latitude, longitude, velocity, CRC)
PACKET_FORMAT = "B I f f f B"  # 1 byte for sensor_id, 4 bytes for timestamp, 3 floats for latitude, longitude, velocity, 1 byte for CRC
PACKET_SIZE = struct.calcsize(PACKET_FORMAT)

# Function to handle the port selection and start reading data
def start_reading():
    selected_port = port_combobox.get()
    if selected_port:
        try:
            # Attempt to open the selected serial port
            ser = serial.Serial(selected_port, 115200, timeout=1)
            print(f"Connected to {selected_port} at 115200 baud.")
            
            # Main loop to receive data
            while True:
                packet = read_packet(ser)
                if packet:
                    print(f"Sensor {packet['sensor_id']}, Timestamp: {packet['timestamp']}, "
                          f"Lat: {packet['latitude']}, Lon: {packet['longitude']}, Velocity: {packet['velocity']}")
                time.sleep(0.1)
        except serial.SerialException as e:
            print(f"Error: Unable to open port {selected_port}. {str(e)}")
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
    else:
        print("No port selected.")

# Create the main window
root = tk.Tk()
root.title("Select Serial Port")

# Get available serial ports
available_ports = get_serial_ports()

# Create a label and dropdown for port selection
label = tk.Label(root, text="Select Serial Port:")
label.pack(pady=10)

port_combobox = ttk.Combobox(root, values=available_ports)
port_combobox.set(available_ports[0] if available_ports else "")  # Set default value
port_combobox.pack(pady=10)

# Create a start button to begin serial communication
start_button = tk.Button(root, text="Start", command=start_reading)
start_button.pack(pady=10)

# Start the Tkinter event loop
root.mainloop()