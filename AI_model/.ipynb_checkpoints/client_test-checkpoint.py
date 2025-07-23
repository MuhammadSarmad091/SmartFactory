# client_test.py

import requests

data = {
    "Temperature_C": 75,
    "Vibration_Hz": 2.5,
    "Power_Consumption_kW": 450,
    "Quality_Control_Defect_Rate_%": 1.5,
    "Production_Speed_units_per_hr": 1000,
    "Error_Rate_%": 0.8,
    "noise_level": 1.2
}

res = requests.post("http://localhost:5000/predict", json=data)
print(res.json())
