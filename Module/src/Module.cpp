#include <Adafruit_ADS1X15.h>
#include <SPI.h>
#include <Arduino.h>

Adafruit_ADS1115 ads;

// Set the desired number of readings per second
int readingsPerSecond = 25; // Adjust this value as needed
int delayBetweenReadings = 1000 / readingsPerSecond;

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
  
  int16_t reading = ads.readADC_Differential_0_1();
  uint16_t answer = reading + 32768;

  Serial.print("Output_Module: ");
  Serial.println(answer);

  Serial2.print("Output: ");
  Serial2.println(answer);

  delay(delayBetweenReadings);
}