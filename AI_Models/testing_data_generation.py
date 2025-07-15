import time
import random
import requests
import datetime

# Fixed companies array for random selection
companies = ["CompanyA", "CompanyB", "CompanyC", "CompanyD"]
num_random_updates = 50
random_updates_count = 50
# Initial data structure
data = {
    "rooms": [
        {
            "name": "machineroom",
            "temperature": 12.5,
            "humidity": 2.3,
            "smoke": 3,  # Smoke sensor reading
            "noise_level": 5.4
        },
        {
            "name": "securityroom",
            "temperature": 11.1,
            "humidity": 3.0,
            "smoke": 1,
            "noise_level": 4.8
        },
        {
            "name": "warehouse",
            "temperature": 15.0,
            "humidity": 4.1,
            "smoke": 2,
            "noise_level": 3.9
        }
    ],
    "machines": [
        {
            "name": "Furnace",
            "temperature": 70,
            "vibration": 3,
            "power_usage": 520,
            "noise_level": 2
        },
        {
            "name": "CylinderShaper",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "BottleShaper",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "CoolingUnit",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "CleaningStation",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "FlawRemovalSystem",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "EncapsulatingMachine",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "LabelingUnit",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        },
        {
            "name": "PackagingMachine",
            "temperature": 45,
            "vibration": 1,
            "power_usage": 500,
            "noise_level": 1
        }

    ]
}

# Generate random sensor data
def generate_sensor_data():
    for room in data["rooms"]:
        room["temperature"] += random.uniform(-1, 1)
        room["humidity"] += random.uniform(-0.5, 0.5)
        room["smoke"] += random.uniform(-1, 1)
        room["noise_level"] += random.uniform(-0.5, 0.5)
    for machine in data["machines"]:
        machine["temperature"] += random.uniform(-5, 5)
        machine["vibration"] += random.uniform(-0.5, 0.5)
        machine["power_usage"] += random.uniform(-20, 20)
        machine["noise_level"] += random.uniform(-0.5, 0.5)

# Send random updates
def send_random_updates():
    if random.random() < 0.5:
        cartons_produced = random.randint(10, 100)
        update = {
            "cartons_produced": cartons_produced,
            "dateTime": datetime.datetime.now().isoformat()
        }
        requests.post("http://localhost:5000/cartons", json=update)
    
    if random.random() < 0.2:
        cartons_sold = random.randint(5, 50)
        update = {
            "cartons_sold": cartons_sold,
            "dateTime": datetime.datetime.now().isoformat(),
            "buyer": random.choice(companies)
        }
        requests.post("http://localhost:5000/sales", json=update)

# Basic AI model to predict maintenance (local simulation)
def predict_maintenance(machines):
    maintenance_types = [
        "Bearing Wear", "Overheating Motor", "Unbalanced Load",
        "Clogged Filter", "Normal Operation"
    ]
    machines_input = [m for m in machines]  # Copy to avoid modifying original
    predictions = []
    for machine in machines_input:
        if machine["temperature"] > 60 or machine["power_usage"] > 510:
            predictions.append(random.choice(["Overheating Motor", "Clogged Filter"]))
        elif machine["vibration"] > 2 or machine["noise_level"] > 2:
            predictions.append(random.choice(["Bearing Wear", "Unbalanced Load"]))
        else:
            predictions.append("Normal Operation")
    return predictions

# Main loop
def main():
    while True:
        generate_sensor_data()
        maintenance_predictions = predict_maintenance(data["machines"])
        for machine, prediction in zip(data["machines"], maintenance_predictions):
            machine["maintenance"] = prediction
        response = requests.post("http://localhost:5000/data", json=data)
        if response.status_code == 200:
            print("Data sent successfully")
        else:
            print(f"Failed to send data: {response.status_code}")
        
        if random_updates_count == 0:
            send_random_updates()
            random_updates_count = num_random_updates
        else:
            random_updates_count=random_updates_count-1
        time.sleep(5)

if __name__ == "__main__":
    main()