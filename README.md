Solar-Powered CO₂ Dashboard (Arduino Uno R4 WiFi + K30 Sensor)

This project is a solar-powered CO₂ monitor using an Arduino Uno R4 WiFi and a K30 10,000 ppm CO₂ sensor. It measures CO₂ in real time and displays readings on a local web page, while simultaneously logging data to Firebase Realtime Database for cloud storage and remote access.

Features

Live CO₂ readings via UART between Arduino and K30 sensor

Web interface hosted on Arduino (accessible via IP)

Solar-powered (5–9 W panel) for off-grid use

Cloud logging with Firebase for historical data and remote monitoring

Dynamic graph showing live PPM readings

Fully wireless within the same Wi-Fi network

Hardware
Component	Description	Cost
Arduino Uno R4 WiFi	Microcontroller with Wi-Fi	$75
K30 CO₂ Sensor	High-accuracy 10,000 ppm CO₂ sensor	$120
Solar Panel	5–9 W for off-grid power	$10–15
Jumper Wires / Connectors	UART and power connections	$5

Total: ~ $200 per device

How It Works

Arduino reads CO₂ from the K30 via UART at 9600 baud.

Readings are displayed on a live web page hosted by the Arduino.

Each reading is also sent to Firebase in JSON format for cloud storage and historical tracking.

This setup allows real-time monitoring, cloud logging, and remote access for a complete CO₂ monitoring solution.

Software

Written in Arduino C++

Uses Serial1 for UART communication

Uses Wi-Fi and HTTPS requests to send data to Firebase

Webpage visualizations use Chart.js
