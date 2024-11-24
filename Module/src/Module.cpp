#include <Adafruit_ADS1X15.h>
#include <SPI.h>
#include <Arduino.h>

Adafruit_ADS1115 ads;

uint8_t data1 = 0;
uint8_t data2 = 0;

// Set the desired number of readings per second
int readingsPerSecond = 25; // Adjust this value as needed
int delayBetweenReadings = 1000 / readingsPerSecond;

// Function to convert unsigned 16-bit data to an array of unsigned 8-bit numbers
void uint16_to_uint8_array(uint16_t data, uint8_t *array)
{
  array[0] = (uint8_t)(data >> 8); // High byte
  array[1] = (uint8_t)data;        // Low byte
}

uint8_t array_data[2];
uint16_t answer;

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial2.begin(115200);
  Serial.println("Hello, I am working fine");
  Serial2.println("Hello, I am working fine");

  if (!ads.begin())
  {
    Serial.println("Failed to initialize ADS.");
    Serial2.println("Failed to initialize ADS.");
    while (1);
  }
}

void loop()
{
  Serial.print(">");
  Serial2.print(">");
  int16_t results;
  results = ads.readADC_Differential_0_1();
  answer = results + 32768;

  uint16_to_uint8_array(answer, array_data);

  data1 = array_data[0];
  data2 = array_data[1];

  Serial.print("data1: ");
  Serial.print(data1);
  Serial.print(",");
  Serial.print("data2: ");
  Serial.print(data2);
  Serial.print(",");
  Serial.print(results);

  Serial2.print("Output: ");
  Serial2.println(results);

  delay(delayBetweenReadings);
}