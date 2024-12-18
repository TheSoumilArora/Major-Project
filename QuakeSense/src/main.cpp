/**
 * @file main.cpp
 * @brief Arduino code to interface with the ADS1115 ADC module using I2C
 * communication and transmit data.
 *
 * @author TheSoumilArora
 * @author Witty-Wizard
 * @date 2024-12-01
 */

#include <Adafruit_ADS1X15.h>
#include <Adafruit_BusIO_Register.h>
#include <Arduino.h>
#include <Wire.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>
#include <string>

static const int RXPin = 18, TXPin = 19;
static const uint32_t GPSBaud = 9600;

// Objects
TinyGPSPlus gps;
Adafruit_ADS1115 ads;
HardwareSerial ss(1);

// Calibration parameters
float scaling_factor = 4.096 / 28.8;  // ADC range of 4.096V for ± and Geophone sensitivity of 28.8 V/m/s
float r1 = 1e3;  // Resistance of R1 in Ohms
float r2 = 6.47e3;  // Resistance of R2 in Ohms
float voltage_divider_factor = r1 / (r1 + r2);  // Voltage divider ratio

// Timing variables
unsigned long last_sensor_read_time = 0; // Last time sensor data was read
unsigned long sensor_read_interval = 10;  // Read sensor every 10ms

// Define variables for GPS and interpolation
unsigned long last_gps_time = 0;     // Last valid GPS timestamp (in milliseconds)
unsigned long interpolated_time = 0; // Current interpolated timestamp
unsigned long gps_interval = 0;      // Time interval between valid GPS updates

void setup()
{
  Serial.begin(115200);   // Start serial communications
  ss.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);  // Initialize GPS serial connection
  Wire.setClock(400000);  // Set I2C clock speed to 400 kHz
  
  if (ads.begin())        // Attempt to initialize ADC
  {
    // If ADC is initialized successfully
    Serial.println("ADC initialized successfully.");
    Serial2.begin(115200);
  }

  else
  {
    // If ADC initialization fails
    Serial.println("Failed to initialize ADC.");
  }
}

void loop()
{
  // Track time elapsed since last sensor read
  unsigned long currentMillis = millis();

  // Read sensor data from ADC
  if (currentMillis - last_sensor_read_time >= sensor_read_interval)
  {
    last_sensor_read_time = currentMillis;  // Update sensor read time

    int16_t raw_value = ads.readADC_Differential_0_1(); // Read differential data from channels 0 and 1
    float calibrated_value = raw_value * scaling_factor * voltage_divider_factor;  // Apply calibration: multiply the raw ADC value by the scaling factor and voltage divider compensation
    
    // Read GPS data
    while (ss.available() > 0)
    {
        gps.encode(ss.read());  // Decode GPS data
    }

    // Handle GPS time and interpolation
    if (gps.time.isValid())
    {
      if (last_gps_time == 0)
      {
        // First GPS time received
        last_gps_time = gps.time.value();
        interpolated_time = last_gps_time;
      }

      else
      {
        // Calculate interval between GPS updates
        gps_interval = gps.time.value() - last_gps_time;

        // Set the interpolated time based on sensor_read_interval
        interpolated_time += sensor_read_interval * (gps_interval / 1000.0);
      }
    }
    
    else
    {
      // Fallback if GPS time is invalid
      interpolated_time += sensor_read_interval;
    }

    // Prepare JSON object
    JsonDocument doc;
    doc["sensor_id"] = 1;
    doc["timestamp"] = interpolated_time;  // Use system millis as fallback
    doc["latitude"] = gps.location.isValid() ? gps.location.lat() : 0;
    doc["longitude"] = gps.location.isValid() ? gps.location.lng() : 0;
    doc["velocity"] = calibrated_value;

    // Send JSON over Serial2 with framing
    Serial2.write("~");  // Start byte for framing
    serializeJson(doc, Serial2);
    Serial2.write("~");  // End byte for framing
    
    // Debugging: Print JSON to Serial Monitor
    serializeJsonPretty(doc, Serial);
    // Serial.println();
    }
}