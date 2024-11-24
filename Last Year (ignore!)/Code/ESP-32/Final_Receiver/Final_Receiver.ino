#include <esp_now.h>
#include <WiFi.h>
#include <cstdint>
#include <Wire.h>

#define CHANNEL 1


uint8_t storage[2];
int positionnumber = 0;


// Set the desired value of sensitivity ranging from 1(Min.) to 6(Max.)
int Sensitivity = 6;
float multiplier;



void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_AP);
  WiFi.softAP("RX_1", "RX_1_Password", CHANNEL, 0);

  esp_now_init();
  esp_now_register_recv_cb(OnDataRecv);
  
  Serial.println("Hello, I am working fine");
  
  if (Sensitivity == 1) {
    multiplier = 0.0078125F;
  } else if (Sensitivity == 2) {
    multiplier = 0.015625F;
  } else if (Sensitivity == 3) {
    multiplier = 0.03125F;
  } else if (Sensitivity == 4) {
    multiplier = 0.0625F;
  } else if (Sensitivity == 5) {
    multiplier = 0.125F;
  } else if (Sensitivity == 6) {
    multiplier = 0.1875F;
  } else {
    Serial.println("Invalid Sensitivity level");
  }
}

void loop() {
  
}


void OnDataRecv(const uint8_t *mac_addr, const uint8_t *data, int data_len){
  if (positionnumber == 0){
    storage[positionnumber] = *data;
    positionnumber++;
    }
  else if (positionnumber == 1){
    storage[positionnumber] = *data;
    positionnumber++;
   }
  else {
    //Serial.print(storage[0]);
    //Serial.print(",");
    //Serial.print(storage[1]);
   // Serial.print(",");
    uint16_t converted_data = uint8_array_to_uint16(storage);
    int16_t int16_data = convert_uint16_to_int16(converted_data);
    int16_t result = int16_data + 32768;
    //Serial.print(converted_data);
    //Serial.print(",");
    //Serial.println(result);
   // Serial.print(",");
    Serial.println(result * multiplier);
    
    positionnumber = 0;
    storage[positionnumber] = *data;
    positionnumber++;
    
  }

}


int16_t convert_uint16_to_int16(uint16_t uint16_data) {
  int16_t int16_data = static_cast<int16_t>(uint16_data);
  return int16_data;
}


// Function to convert an array of unsigned 8-bit numbers back to unsigned 16-bit data
uint16_t uint8_array_to_uint16(const uint8_t *array) {
    return ((uint16_t)array[0] << 8) | array[1];
}
