#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <cstdint>

Adafruit_ADS1115 ads;

#include <esp_now.h>
#include <WiFi.h>

#define CHANNEL 1

esp_now_peer_info_t slave;

uint8_t data1 = 0;
uint8_t data2 = 0;

// Set the desired number of readings per second
int readingsPerSecond = 25; // Adjust this value as needed
int delayBetweenReadings = 1000 / readingsPerSecond;


// Function to convert unsigned 16-bit data to an array of unsigned 8-bit numbers
void uint16_to_uint8_array(uint16_t data, uint8_t *array) {
    array[0] = (uint8_t)(data >> 8);   // High byte
    array[1] = (uint8_t)data;          // Low byte
}

uint8_t array_data[2];
uint16_t answer;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Hello, I am working fine");

  if (!ads.begin()) {
    Serial.println("Failed to initialize ADS.");
    while (1);
  }
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_send_cb(OnDataSent);
  ScanForSlave();
  esp_now_add_peer(&slave);
}

void loop() {
  // put your main code here, to run repeatedly:
  int16_t results;
  results = ads.readADC_Differential_0_1();
  answer = results + 32768;

  uint16_to_uint8_array(answer, array_data);

  data1 = array_data[0];
  data2 = array_data[1];


  esp_now_send(slave.peer_addr, &data1, sizeof(data1));
  //delay(10);
  esp_now_send(slave.peer_addr, &data2, sizeof(data2));
  
  //Serial.print(data1);
  //Serial.print(",");
  //Serial.print(data2);
  //Serial.print(",");
  Serial.println(results);
  delay(delayBetweenReadings);
  
}




void ScanForSlave() {
  int8_t scanResults = WiFi.scanNetworks();

  for(int i = 0; i < scanResults; ++i) {
    String SSID = WiFi.SSID(i);
    String BSSIDstr = WiFi.BSSIDstr(i);

    if (SSID.indexOf("RX") == 0){

      int mac[6];
      if( 6 == sscanf(BSSIDstr.c_str(), "%x:%x:%x:%x:%x:%x", &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5] )){
         for (int ii = 0; ii < 6; ++ii ){
          slave.peer_addr[ii] = (uint8_t) mac[ii];
        }
      }

      slave.channel = CHANNEL;
      slave.encrypt = 0;
      break;
    }
  }
}


void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status){
  //Serial.println(data1);
  //Serial.println(data2);
}
