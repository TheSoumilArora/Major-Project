# QuakeSense

<p align="center">
  <img src="https://img.shields.io/github/v/release/TheSoumilArora/Major-Project" alt="GitHub Release">
  <img src="https://img.shields.io/github/stars/TheSoumilArora/Major-Project?style=flat" alt="GitHub Repo stars">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/TheSoumilArora/Major-Project">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/TheSoumilArora/Major-Project?style=flat">
  <img src="https://img.shields.io/github/license/TheSoumilArora/Major-Project" alt="GitHub License">
</p>

## Overview

QuakeSense is a project designed to measure seismic activity using a geophone and transmit the data to a control station for visualization and analysis. The system combines hardware efficiency with reliable data communication.

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
