🏭 Digital Twin Smart Factory
A comprehensive Digital Twin system for simulating, monitoring, and predicting the behavior of a smart factory using cutting-edge web technologies, 3D visualization, and AI.

🔍 Overview
This project aims to build a Digital Twin of a smart factory that offers:

3D factory visualization using Unity

Real-time monitoring of machine status via a MERN stack web application

AI-based fault and maintenance prediction for factory machines

IoT data simulation using Node-RED and Python

RESTful APIs served through FASTAPI for AI model integration

🧱 Project Architecture
sql
Copy
Edit
+----------------+     POST sensor data     +---------------------+
| Node-RED /     |  ----------------------> |     Express.js API   |
| Python Script  |                          |   (Backend - MERN)   |
+----------------+                          +----------+----------+
                                                      |
                                                      v
                                      +-------------------------------+
                                      |         MongoDB Atlas         |
                                      +-------------------------------+
                                                      |
                                                      v
                          +---------------------+     GET state     +----------------+
                          |     React Web App   | <---------------- |  Express.js    |
                          |  (Monitoring Panel) |                  |  Backend API   |
                          +---------------------+                  +----------------+
                                     |
                                     | Fetch metadata & control data
                                     v
                        +------------------------------+
                        |    Unity 3D Digital Twin     |
                        |  (WebGL Embedded in React)   |
                        +------------------------------+

🔧 Tech Stack
🎮 Unity (WebGL Build)
3D model of the factory floor and machines

Clickable/interactable components

Embedded in React using iframe or custom loader

🌐 MERN Stack Web App
MongoDB: Stores machine metadata and status logs

Express.js: Backend API to receive & serve sensor/machine data

React.js: Interactive dashboard with real-time updates

Node.js: Server runtime

🧠 AI/ML Models
Built with Python (e.g., Scikit-learn, XGBoost, etc.)

Predicts:

Machine failure likelihood

Recommended maintenance schedule

Exposed via FASTAPI

🔄 IoT Data Simulation
Node-RED or Python script used to:

Generate realistic sensor data (temperature, RPM, vibration, etc.)

Send data to backend at regular intervals

🚀 Features
📡 Simulated IoT Inputs: Emulate factory sensors through custom flows and scripts

🌍 Real-Time Digital Twin: WebGL-based interactive 3D model synced with backend data

📊 Live Dashboard: Monitor status, logs, and analytics of each machine

🧠 Smart Predictions: Fault and maintenance predictions via integrated AI models

🔌 REST APIs: Clean modular API integration for AI and frontend/backend communication

