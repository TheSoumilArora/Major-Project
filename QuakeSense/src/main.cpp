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

// Delay between run cycles in milliseconds
uint8_t delayTime = 5;

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

// Function to send a MAVLink heartbeat message
void sendHeartbeat(Stream *port)
{
  mavlink_message_t msg;
  uint16_t len;

  mavlink_msg_heartbeat_pack(system_id, component_id, &msg, MAV_TYPE_GENERIC,
                             MAV_AUTOPILOT_GENERIC, 0, 0, MAV_STATE_ACTIVE);

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
  // Start serial communications
  Serial.begin(115200);

  // Set I2C clock speed to 400 kHz
  Wire.setClock(400000);
  // Attempt to initialize ADC
  if (ads.begin())
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
  static uint32_t last_heartbeat_time = 0;
  static uint32_t last_sine_wave_time = 0;
  static int sine_index = 0;

  // Send heartbeat periodically
  if (millis() - last_heartbeat_time > 1000)
  {
    if (currentState == RUN)
    {
      sendHeartbeat(&Serial2);
    }
    
    else
    {
      sendHeartbeat(&Serial);
    }

    last_heartbeat_time = millis();
  }

  // State machine logic
  switch (currentState)
  {
  case RUN:
  {
    // Read differential data from channels 0 and 1
    int16_t reading = ads.readADC_Differential_0_1();

    Serial.print(">");
    Serial.print("Output_Module: ");
    Serial.println(reading);

    // Send ADC data via MAVLink
    mavlink_message_t msg;
    uint16_t len;
    mavlink_msg_param_value_pack(system_id, component_id, &msg, "ADC_READING",
                                 reading, MAV_PARAM_TYPE_INT16, 1, 0);
    len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
    Serial2.write(mavlink_buffer, len);

    // Delay between iterations
    delay(delayTime);
    break;
  }

  case SEND_SINE_WAVE:
  {
    // Generate sine wave data (simulated for testing)
    float sine_wave_value =
        32768.0 *
        (1.0 + sin(2 * PI * SINE_WAVE_FREQUENCY * (millis() / 1000.0)));
    uint16_t sine_wave_int = (uint16_t)sine_wave_value;

    // Send sine wave data via MAVLink
    mavlink_message_t msg;
    uint16_t len;
    mavlink_msg_param_value_pack(system_id, component_id, &msg, "ADC_READING",
                                 sine_wave_int, MAV_PARAM_TYPE_UINT16, 1, 0);
    len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
    Serial.write(mavlink_buffer, len);

    // Simulate a delay between sine wave data packets
    delay(delayTime);

    break;
  }
  }
}
