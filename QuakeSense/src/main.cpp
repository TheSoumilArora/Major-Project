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

#define SINE_WAVE_FREQUENCY 1.0 // Frequency of sine wave in Hz

// Create an ADS1115 ADC object
Adafruit_ADS1115 ads;

// MAVLink parameters
uint8_t system_id = 1;           // ID of this system
uint8_t component_id = 1;        // ID of this component
uint8_t target_system_id = 0;    // Will be set after handshake
uint8_t target_component_id = 0; // Will be set after handshake

// MAVLink message buffer
uint8_t mavlink_buffer[MAVLINK_MAX_PACKET_LEN];

// State machine states
enum State {INIT, RUN, SEND_SINE_WAVE};
State currentState = INIT; // Start in the INIT state

// Timing variables
unsigned long last_heartbeat_time = 0;  // Last time heartbeat was sent
unsigned long last_sensor_read_time = 0; // Last time sensor data was read
unsigned long last_sine_wave_time = 0;  // Last time sine wave was sent

unsigned long heartbeat_interval = 1000;  // Send heartbeat every 1000ms (1s)
unsigned long sensor_read_interval = 10;  // Read sensor every 10ms
unsigned long sine_wave_interval = 500;  // Send sine wave every 500ms

// Function to send a MAVLink heartbeat message
void sendHeartbeat(Stream *port)
{
  mavlink_message_t msg;
  uint16_t len;

  mavlink_msg_heartbeat_pack(system_id, component_id, &msg, MAV_TYPE_GENERIC, MAV_AUTOPILOT_GENERIC, 0, 0, MAV_STATE_ACTIVE);

  len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
  port->write(mavlink_buffer, len);
}

// Function to read MAVLink messages from port
bool readMavlinkMessage(Stream *port, mavlink_message_t *msg)
{
  static mavlink_status_t status;
  while (port->available() > 0)
  {
    uint8_t c = port->read();
    if (mavlink_parse_char(MAVLINK_COMM_0, c, msg, &status))
    {
      return true;
    }
  }
  return false;
}

void setup()
{
  Serial.begin(115200);   // Start serial communications

  Wire.setClock(400000);  // Set I2C clock speed to 400 kHz

  if (ads.begin())        // Attempt to initialize ADC
  {
    // If ADC is initialized successfully, switch to RUN state
    Serial.println("ADC initialized successfully.");
    currentState = RUN;
    Serial2.begin(115200);
  }

  else
  {
    // If ADC initialization fails, switch to SEND_SINE_WAVE state
    Serial.println("Failed to initialize ADC. Sending sine wave data.");
    currentState = SEND_SINE_WAVE;
  }
}

void loop()
{
  // Track time elapsed since last heartbeat, sensor read, or sine wave transmission
  unsigned long currentMillis = millis();

  // Handle heartbeat transmission every 1 second
  if (currentMillis - last_heartbeat_time >= heartbeat_interval)
  {
    sendHeartbeat(&Serial2);  // Send heartbeat to Serial2 (MAVLink)
    last_heartbeat_time = currentMillis;  // Update heartbeat time
  }

  // State machine logic
  switch (currentState)
  {
  case RUN:
  {
    // Read sensor data every 50 ms
    if (currentMillis - last_sensor_read_time >= sensor_read_interval)
    {
      int16_t reading = ads.readADC_Differential_0_1();
      
      // Serial.print(">");
      // Serial.print("Output_Module: ");
      // Serial.println(reading);

      // Send ADC data via MAVLink (to Serial2)
      mavlink_message_t msg;
      uint16_t len;
      mavlink_msg_param_value_pack(system_id, component_id, &msg, "ADC_READING", (float)reading, MAV_PARAM_TYPE_INT16, 1, 0);
      len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
      Serial2.write(mavlink_buffer, len);  // Send MAVLink data to Serial2

      last_sensor_read_time = currentMillis;  // Update sensor read time
    }
    break;
  }

  case SEND_SINE_WAVE:
  {
    // Generate sine wave data (simulated for testing)
    if (currentMillis - last_sine_wave_time >= sine_wave_interval)
    {
      float sine_wave_value = 32768.0 * (1.0 + sin(2 * PI * SINE_WAVE_FREQUENCY * (currentMillis / 1000.0)));
      uint16_t sine_wave_int = (uint16_t)sine_wave_value;

      // Send sine wave data via MAVLink (to Serial2)
      mavlink_message_t msg;
      uint16_t len;
      mavlink_msg_param_value_pack(system_id, component_id, &msg, "ADC_READING", sine_wave_int, MAV_PARAM_TYPE_UINT16, 1, 0);
      len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
      Serial2.write(mavlink_buffer, len);  // Send sine wave data to Serial2

      last_sine_wave_time = currentMillis;  // Update sine wave time
    }
    break;
  }
}
