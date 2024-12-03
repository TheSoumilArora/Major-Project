/**
 * @file main.cpp
 * @brief Arduino code to interface with the ADS1115 ADC module using I2C
 * communication and transmit data via MAVLink protocol.
 *
 * This program initializes the ADS1115 ADC module, sets up the desired gain
 * and sampling rate, and continuously reads differential data from channels 0
 * and 1. The results are sent via MAVLink on Serial2. Additionally, it
 * implements MAVLink heartbeat, handshake, and negotiation to MAVLink 2.
 *
 * @author TheSoumilArora
 * @author Witty-Wizard
 * @date 2024-12-01
 */

#include <Adafruit_ADS1X15.h>
#include <Adafruit_BusIO_Register.h>
#include <Arduino.h>
#include <Wire.h>
#include <common/mavlink.h>
#include <math.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>

static const int RXPin = 18, TXPin = 19;
static const uint32_t GPSBaud = 9600;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
HardwareSerial ss(1);

// Create an ADS1115 ADC object
Adafruit_ADS1115 ads;

// Calibration parameters
float scaling_factor = 4.096 / 28.8;  // ADC range of 4.096V for ± and Geophone sensitivity of 28.8 V/m/s
float r1 = 1e3;  // Resistance of R1 in Ohms
float r2 = 6.47e3;  // Resistance of R2 in Ohms
float voltage_divider_factor = r1 / (r1 + r2);  // Voltage divider ratio

// Timing variables
unsigned long last_sensor_read_time = 0; // Last time sensor data was read
unsigned long sensor_read_interval = 10;  // Read sensor every 10ms

// Create a custom data packet format
struct DataPacket
{
  uint8_t sensor_id;      // 1 byte
  uint32_t timestamp;     // 4 bytes
  float latitude;         // 4 bytes
  float longitude;        // 4 bytes
  float velocity;         // 4 bytes
};

// Add a function to calculate CRC (simple XOR example)
uint8_t calculateCRC(uint8_t* data, size_t length)
{
    uint8_t crc = 0;
    for (size_t i = 0; i < length; i++)
    {
        crc ^= data[i];
    }
    return crc;
}
// Send Packet and CRC
void sendPacket(DataPacket packet)
{
    uint8_t* data = (uint8_t*)&packet;
    uint8_t crc = calculateCRC(data, sizeof(packet));
    Serial2.write(data, sizeof(packet));
    Serial2.write(crc);  // Send CRC as the last byte
    Serial2.flush();  // Wait for transmission to complete
}

void setup()
{
  Serial.begin(115200);   // Start serial communications
  ss.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);  // Initialize GPS serial connection
  Wire.setClock(400000);  // Set I2C clock speed to 400 kHz
  
  if (ads.begin())        // Attempt to initialize ADC
  {
    // If ADC is initialized successfully
    Serial.println("ADC initialized successfully.");
    Serial2.println("ADC initialized successfully.");
    Serial2.begin(115200);
  }

  else
  {
    // If ADC initialization fails
    Serial.println("Failed to initialize ADC.");
    Serial2.println("Failed to initialize ADC.");    
  }
}

void loop()
{
  // Track time elapsed since last sensor read
  unsigned long currentMillis = millis();

  // Read sensor data from ADC
  if (currentMillis - last_sensor_read_time >= sensor_read_interval)
  {
    int16_t raw_value = ads.readADC_Differential_0_1();
    // Apply calibration: multiply the raw ADC value by the scaling factor and voltage divider compensation
    float calibrated_value = raw_value * scaling_factor * voltage_divider_factor;
    
    // Read GPS data
    while (ss.available() > 0)
    {
      gps.encode(ss.read());  // Decode GPS data
    }

    if (gps.location.isUpdated())
    {
      // Prepare custom data packet
      DataPacket packet = {0};              // Zero-initialize the packet to avoid garbage data
      packet.sensor_id = 1;                 // Sensor ID for ADC
      packet.timestamp = gps.time.value();  // Use GPS timestamp for synchronization
      packet.latitude = gps.location.lat();
      packet.longitude = gps.location.lng();
      packet.velocity = calibrated_value;

      // Send custom data packet via Serial2
      sendPacket(packet);

      // Debugging: Print the sent data
      Serial.print("Sent Packet: ");
      Serial.print("Lat: ");
      Serial.print(packet.latitude, 6);
      Serial.print(", Lon: ");
      Serial.print(packet.longitude, 6);
      Serial.print(", Velocity: ");
      Serial.println(packet.velocity);

      last_sensor_read_time = currentMillis;  // Update sensor read time
    }

    else
    {
      Serial.println("GPS location not updating");
      Serial2.println("GPS location not updating");
    }
  }
}