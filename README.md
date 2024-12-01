# QuakeSense

<p align="center">
  <img src="https://img.shields.io/github/v/release/Witty-Wizard/QuakeSense" alt="GitHub Release">
  <img src="https://img.shields.io/github/stars/Witty-Wizard/QuakeSense?style=flat" alt="GitHub Repo stars">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/Witty-Wizard/QuakeSense">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/Witty-Wizard/QuakeSense?style=flat">
  <img src="https://img.shields.io/github/license/Witty-Wizard/QuakeSense" alt="GitHub License">
</p>

## Overview

This project measures the Sesmic activity using a geophone and transmit them to a control station for visualisation

## Prerequisits

1. Platform IO
   - Via **pip**: `pip install platformio`
   - As a **VS Code extension**: [PlatformIO VS Code Extension](https://platformio.org/install/ide?install=vscode)
2. Hardware Requirements:
   - SM-24 Geophone
   - ESP32 or equivalent microcontroller
   - ADS1115 ADC
   - Level shifters (if necessary)
   - Supporting resistors and connectors (e.g., 1kΩ resistors)

## References

- [**SM-24 Geophone Datasheet**](https://cdn.sparkfun.com/datasheets/Sensors/Accelerometers/SM-24%20Brochure.pdf)
