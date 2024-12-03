import serial
import serial.tools.list_ports
import json

# Function to list all available serial ports
def get_serial_ports():
    ports = serial.tools.list_ports.comports()
    return [port.device for port in ports]

# Function to read JSON packets
def read_json_packet(ser):
    try:
        # Read a line from the serial port
        line = ser.readline().decode('utf-8').strip()
        print(f"Raw JSON: {line}")
        return json.loads(line)  # Parse JSON string to Python dict
    except json.JSONDecodeError:
        print("Invalid JSON received.")
        return None
    except Exception as e:
        print(f"Error reading JSON packet: {str(e)}")
        return None

# Main function to handle CLI-based serial port selection and data reading
def main():
    ports = get_serial_ports()
    if not ports:
        print("No serial ports detected!")
        return

    print("Available Ports:")
    for i, port in enumerate(ports):
        print(f"{i}: {port}")

    try:
        selected_index = int(input("Select Port Number: "))
        if selected_index < 0 or selected_index >= len(ports):
            print("Invalid selection.")
            return
        selected_port = ports[selected_index]
    except ValueError:
        print("Invalid input. Please enter a valid number.")
        return

    try:
        ser = serial.Serial(selected_port, 115200, timeout=1)
        print(f"Connected to {selected_port} at 115200 baud.")

        # Main loop to read and print JSON data
        while True:
            packet = read_json_packet(ser)
            if packet:
                print(f"Sensor {packet['sensor_id']}, Timestamp: {packet['timestamp']}, "
                      f"Lat: {packet['latitude']}, Lon: {packet['longitude']}, Velocity: {packet['velocity']}")
    except serial.SerialException as e:
        print(f"Error: Unable to open port {selected_port}. {str(e)}")
    except KeyboardInterrupt:
        print("\nExiting program.")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()