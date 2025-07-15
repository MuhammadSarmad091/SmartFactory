import csv
import random

# Range of values for features
temp_range = (40, 1700)  # Broad range for Furnace, narrower for others
vib_range = (0, 5)
power_range = (300, 700)
noise_range = (0, 5)

# Machine names from your script
machines = [
    "Furnace", "CylinderShaper", "BottleShaper", "CoolingUnit",
    "CleaningStation", "FlawRemovalSystem", "EncapsulatingMachine",
    "LabelingUnit", "PackagingMachine"
]

# Function to generate a row with maintenance based on patterns
def generate_row():
    machine = random.choice(machines)
    temp = random.uniform(temp_range[0], temp_range[1] if machine == "Furnace" else 100)
    vib = random.uniform(vib_range[0], vib_range[1])
    power = random.uniform(power_range[0], power_range[1])
    noise = random.uniform(noise_range[0], noise_range[1])

    # Pattern-based maintenance assignment with multiple features
    if machine == "Furnace" and temp > 1500 and power > 550:
        maintenance = "Overheating Motor"  # High temp and power for melting
    elif machine in ["CylinderShaper", "BottleShaper"] and vib > 2.5 and noise > 2:
        maintenance = "Bearing Wear"  # Vibration and noise in shaping
    elif machine == "CoolingUnit" and temp > 50 and power > 520:
        maintenance = "Clogged Filter"  # Temp and power inefficiency
    elif machine in ["CleaningStation", "FlawRemovalSystem"] and vib > 2 and power > 520:
        maintenance = "Unbalanced Load"  # Vibration and power imbalance
    elif machine in ["EncapsulatingMachine", "LabelingUnit", "PackagingMachine"] and power > 520 and noise > 2:
        maintenance = "Clogged Filter"  # Power and noise issues
    else:
        if random.random() < 0.2 and (temp > 40 or vib > 1 or power > 500 or noise > 1): # atleast one feature exceeds a moderate threshold
            maintenance = random.choice(["Overheating Motor", "Bearing Wear", "Unbalanced Load", "Clogged Filter"])
        else:
            maintenance = "Normal Operation"

    return [temp, vib, power, noise, maintenance]

# Generating the dataset
with open("machine_dataset.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["temperature", "vibration", "power_usage", "noise_level", "maintenance"])
    for _ in range(1000):
        writer.writerow(generate_row())

print("Dataset generated as 'machine_dataset.csv'")