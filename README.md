
# Digital Twin Smart Factory 🚀🏭
A comprehensive Digital Twin system for simulating, monitoring, and predicting the behavior of a smart factory using cutting‑edge 3D visualization, real‑time web technologies, and AI.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Services](#running-the-services)
- [Folder Structure](#folder-structure)

---

## Overview

This project builds a **Digital Twin** of a smart factory, featuring:

- **3D Visualization** of factory floor & machines using Unity (WebGL)
- **Real‑time Monitoring** and control via a MERN‑stack dashboard
- **AI‑driven** fault & maintenance prediction
- **Simulated IoT** sensor data using Node‑RED / Python
- **RESTful APIs** for AI model integration via FastAPI

---

## Architecture



## Tech Stack

* **Unity (WebGL)** – Interactive 3D factory & machine models
* **MongoDB Atlas** – Stores machine metadata & status logs
* **Express.js / Node.js** – Backend API for data ingestion & serving
* **React.js** – Real‑time dashboard & Unity WebGL integration
* **Node‑RED / Python** – IoT sensor data simulation
* **FastAPI** – REST API wrapping ML models
* **Python** (Scikit‑learn, XGBoost) – Fault & maintenance prediction

---

## Features

* 📡 **Simulated IoT Inputs** – Realistic sensor flows (temperature, vibration, RPM)
* 🌍 **Interactive Digital Twin** – WebGL 3D model synced with live data
* 📊 **Live Dashboard** – Machine status, logs, analytics & alerts
* 🤖 **AI Predictions** – Early fault detection & maintenance scheduling
* 🔌 **Modular APIs** – Clear separation between simulator, backend, frontend & AI

---

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm
* Python (v3.8 or higher)
* Unity Editor (for WebGL build)

### Installation

```bash
# Clone the repository
git clone https://github.com/MuhammadSarmad091/SmartFactory.git
cd SmartFactory
```

Create `.env` files in the following directories and add your environment variables:

* `Web/Backend/.env`         Variables to add : `MONGO_URI` , `JWT_SECRET`
* `Web/Frontend/.env`        Variables to add : `VITE_API_BASE_URL` (Express Backend API URL)
* `Data_generation/.env`     Variables to add : `AI_API_BASE_URL` , `BACKEND_API_BASE_URL`


### Running the Services

1. **Express.js Backend**

   ```bash
   cd Backend
   npm install
   npm start
   ```
2. **React Frontend**

   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
3. **FastAPI AI Server**

   ```bash
   cd AI_model
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
4. **IoT Simulator**

   * **Python**:

     ```bash
     cd Data_generation
     pip install python-dotenv
     python testing_data_generation.py
     ```
5. **Unity WebGL Build**

   * Export the Unity project as a WebGL build
   * Copy build output into `Web/Frontend/public/unity/`
   * The React app will automatically load it

---

## Folder Structure

```
SmartFactory/
├── Web/           
│   └── Backend/   # Express backend
│   └── Frontend/     # React frontend
├── Data_generation/           # IOT Simulation
├── AI_model/         # FastAPI ML model
└── unity/            # Unity project source
```



