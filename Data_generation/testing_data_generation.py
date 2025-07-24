import time
import random
import requests
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

ai_api_url = os.getenv("AI_API_BASE_URL")
backend_api_url = os.getenv("BACKEND_API_BASE_URL")


# Fixed companies array for random selection
companies = [
    "AquaPure Distributors",
    "HydroWave Retailers",
    "CrystalClear Beverages",
    "EcoSip Packaging",
    "UrbanSpring Bottling Co.",
    "BlueDrop Traders",
    "FreshFlow Retail Pvt Ltd"
]
num_random_updates = 50
random_updates_count = 50

# Initial data structure
data = {
    "rooms": [
        {
            "name": "Machine Room",
            "temperature": 15.0,
            "humidity": 2.5,
            "smoke": 2.0,
            "noise_level": 4.0
        },
        {
            "name": "Security Room",
            "temperature": 12.0,
            "humidity": 3.0,
            "smoke": 1.0,
            "noise_level": 4.5
        },
        {
            "name": "Warehouse",
            "temperature": 14.0,
            "humidity": 4.0,
            "smoke": 1.5,
            "noise_level": 3.5
        }
    ],
    "machines": [
        {
            "name": "Furnace",
            "temperature": 70.0,
            "vibration": 3.0,
            "power_usage": 7.0,
            "production_speed": 300.0,
            "noise_level": 3.0
        },
        {
            "name": "Cylinder Creator",
            "temperature": 50.0,
            "vibration": 1.5,
            "power_usage": 4.0,
            "production_speed": 250.0,
            "noise_level": 1.5
        },
        {
            "name": "Bottle Shaper",
            "temperature": 45.0,
            "vibration": 1.0,
            "power_usage": 3.5,
            "production_speed": 200.0,
            "noise_level": 1.0
        },
        {
            "name": "Cooler",
            "temperature": 40.0,
            "vibration": 0.5,
            "power_usage": 2.5,
            "production_speed": 150.0,
            "noise_level": 0.5
        },
        {
            "name": "Cleaner",
            "temperature": 35.0,
            "vibration": 1.0,
            "power_usage": 3.0,
            "production_speed": 180.0,
            "noise_level": 1.0
        },
        {
            "name": "Encapsulator",
            "temperature": 55.0,
            "vibration": 2.0,
            "power_usage": 5.0,
            "production_speed": 220.0,
            "noise_level": 2.0
        },
        {
            "name": "Labeller",
            "temperature": 50.0,
            "vibration": 1.5,
            "power_usage": 4.5,
            "production_speed": 230.0,
            "noise_level": 1.5
        },
        {
            "name": "Packager",
            "temperature": 60.0,
            "vibration": 2.5,
            "power_usage": 6.0,
            "production_speed": 280.0,
            "noise_level": 2.5
        }
    ]
}

# Generate random sensor data
def generate_sensor_data():
    for room in data["rooms"]:
        room["temperature"] = round(room["temperature"] + random.uniform(-1.0, 1.0), 2)
        room["humidity"] = round(room["humidity"] + random.uniform(-0.5, 0.5), 2)
        room["smoke"] = round(room["smoke"] + random.uniform(-0.5, 0.5), 2)
        room["noise_level"] = round(max(0, min(5, room["noise_level"] + random.uniform(-0.5, 0.5))), 2)
    for machine in data["machines"]:
        machine["temperature"] = round(max(30, min(89, machine["temperature"] + random.uniform(-5.0, 5.0))), 2)
        machine["vibration"] = round(max(0, min(5, machine["vibration"] + random.uniform(-0.5, 0.5))), 2)
        machine["power_usage"] = round(max(1, min(10, machine["power_usage"] + random.uniform(-1.0, 1.0))), 2)
        machine["production_speed"] = round(max(50, min(500, machine["production_speed"] + random.uniform(-50.0, 50.0))), 2)
        machine["noise_level"] = round(max(0, min(5, machine["noise_level"] + random.uniform(-0.5, 0.5))), 2)

# Send random updates
def send_random_updates():
    if random.random() < 0.5:
        cartons_produced = random.randint(10, 100)
        update = {
            "cartons_produced": cartons_produced,
            "DateTime": datetime.datetime.now().isoformat()
        }
        response = requests.post(f"{backend_api_url}/tx/cartons", json=update)
        if response.status_code != 200:
            print(f"Failed to send cartons update: {response.status_code} - {response.text}")
    
    if random.random() < 0.2:
        cartons_sold = random.randint(5, 50)
        update = {
            "cartons_sold": cartons_sold,
            "DateTime": datetime.datetime.now().isoformat(),
            "Buyer": random.choice(companies)
        }
        response = requests.post(f"{backend_api_url}/tx/sale", json=update)
        if response.status_code != 200:
            print(f"Failed to send sale update: {response.status_code} - {response.text}")

# Main loop
def main():
    random_updates_count = 50
    while True:
        generate_sensor_data()
        # Fetch predictions from AI model
        machines_input = [{"temperature": m["temperature"], "vibration": m["vibration"],
                          "power_usage": m["power_usage"], "production_speed": m["production_speed"],
                          "noise_level": m["noise_level"]} for m in data["machines"]]
        response = requests.post(f"{ai_api_url}/predict", json=machines_input)
        if response.status_code == 200:
            maintenance_predictions = response.json()
            for machine, prediction in zip(data["machines"], maintenance_predictions):
                machine["maintenance"] = prediction
        else:
            print(f"Failed to fetch predictions: {response.status_code} - {response.text}")
            continue
        
        update_data = {
            "rooms": [{"name": r["name"], "temperature": r["temperature"], "humidity": r["humidity"],
                       "smoke": r["smoke"], "noise_level": r["noise_level"]} for r in data["rooms"]],
            "machines": [{"name": m["name"], "temperature": m["temperature"], "vibration": m["vibration"],
                          "power_usage": m["power_usage"], "noise_level": m["noise_level"],
                          "maintenance": m["maintenance"]} for m in data["machines"]]
        }
        response = requests.put(f"{backend_api_url}/sensorData/", json=update_data)
        if response.status_code == 200:
            print("Data updated successfully")
        else:
            print(f"Failed to update data: {response.status_code} - {response.text}")
        
        if random_updates_count == 0:
            send_random_updates()
            random_updates_count = num_random_updates
        else:
            random_updates_count -= 1
        time.sleep(5)

if __name__ == "__main__":
    main()