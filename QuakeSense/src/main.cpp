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

#define OFFSET 32768

// Create an ADS1115 ADC object
Adafruit_ADS1115 ads;

// MAVLink parameters
uint8_t system_id = 1;           // ID of this system
uint8_t component_id = 1;        // ID of this component
uint8_t target_system_id = 0;    // Will be set after handshake
uint8_t target_component_id = 0; // Will be set after handshake

// MAVLink message buffer
uint8_t mavlink_buffer[MAVLINK_MAX_PACKET_LEN];

/**
 * @brief Send a MAVLink heartbeat message.
 */
void sendHeartbeat(Stream *port) {
  mavlink_message_t msg;
  uint16_t len;

  mavlink_msg_heartbeat_pack(system_id, component_id, &msg, MAV_TYPE_GENERIC,
                             MAV_AUTOPILOT_GENERIC, 0, 0, MAV_STATE_ACTIVE);

  len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
  port->write(mavlink_buffer, len);
}

/**
 * @brief Read MAVLink messages from port.
 *
 * @param msg Pointer to a MAVLink message structure to store the received
 * message.
 * @return true if a valid MAVLink message is received, false otherwise.
 */
bool readMavlinkMessage(Stream *port, mavlink_message_t *msg) {
  static mavlink_status_t status;
  while (port->available() > 0) {
    uint8_t c = port->read();
    if (mavlink_parse_char(MAVLINK_COMM_0, c, msg, &status)) {
      return true;
    }
  }
  return false;
}

/**
 * @brief Perform MAVLink handshake and negotiation to MAVLink 2.
 */
void mavlinkHandshake() {
  mavlink_message_t msg;

  while (true) {
    sendHeartbeat(&Serial2);
    delay(100);

    if (readMavlinkMessage(&Serial2, &msg)) {
      if (msg.msgid == MAVLINK_MSG_ID_HEARTBEAT) {
        mavlink_heartbeat_t heartbeat;
        mavlink_msg_heartbeat_decode(&msg, &heartbeat);

        target_system_id = msg.sysid;
        target_component_id = msg.compid;

        Serial.println("MAVLink handshake successful!");
        return;
      }
    }
  }
}

void setup() {
  // Start serial communications
  Serial.begin(115200);
  Serial2.begin(115200);

  // Set I2C clock speed to 400 kHz
  Wire.setClock(400000);

  // Initialize ADS1115 and check for errors
  if (!ads.begin()) {
    Serial.println("Failed to initialize ADS.");
    Serial2.println("Failed to initialize ADS.");
    while (1)
      ; // Enter infinite loop if initialization fails
  }

  // Configure ADS1115 gain and sampling rate
  ads.setGain(GAIN_ONE); // Gain set to ±4.096V range
  ads.setDataRate(
      RATE_ADS1115_860SPS); // Data rate set to 860 samples per second

  // Perform MAVLink handshake and negotiation
  mavlinkHandshake();
}

void loop() {
  // Send heartbeat periodically
  static uint32_t last_heartbeat_time = 0;
  if (millis() - last_heartbeat_time > 1000) {
    sendHeartbeat();
    last_heartbeat_time = millis();
  }

  // Read differential data from channels 0 and 1
  int16_t reading = ads.readADC_Differential_0_1();

  // Add offset to raw reading to handle signed-to-unsigned conversion
  uint16_t answer = reading + OFFSET;

  // Send ADC data via MAVLink
  mavlink_message_t msg;
  uint16_t len;
  mavlink_msg_param_value_pack(system_id, component_id, &msg, "ADC_READING",
                               answer, MAV_PARAM_TYPE_UINT16, 1, 0);
  len = mavlink_msg_to_send_buffer(mavlink_buffer, &msg);
  Serial2.write(mavlink_buffer, len);

  // Delay of 10 ms between iterations
  delay(10);
}
