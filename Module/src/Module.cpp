#include <Adafruit_ADS1X15.h>
#include <SPI.h>
#include <Arduino.h>
#include <Wire.h>

Adafruit_ADS1115 ads;  // Create an ADS1115 ADC object

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial2.begin(115200);

Wire.setClock(400000);  // Set I2C clock to 400 kHz (fast mode)

  if (!ads.begin())
  {
    Serial.println("Failed to initialize ADS.");
    Serial2.println("Failed to initialize ADS.");
    while (1);
  }
  ads.setGain(GAIN_ONE); // This sets the gain to 1, which gives a range of ±4.096V
  ads.setDataRate(RATE_ADS1115_860SPS); // This sets the data rate to 860 samples per second
}

void loop()
{
  int16_t reading = ads.readADC_Differential_0_1();
  uint16_t answer = reading + 32768;

  Serial.print(">");
  Serial.print("Output_Module: ");
  Serial.println(answer);

  static int counter = 0;
  if (counter % 5 == 0) {
    Serial2.print(">");
    Serial2.print("Output: ");
    Serial2.println(answer);
    counter = 0;
  }
  counter++;
  
  delay(10);
}