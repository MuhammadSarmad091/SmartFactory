from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from app.model_utils import load_models

app = FastAPI()

clf, _, label_encoder = load_models()

feature_columns = [
    'temperature',
    'vibration',
    'power_usage',
    'production_speed',
    'noise_level'
]

class SensorData(BaseModel):
    temperature: float
    vibration: float
    power_usage: float
    production_speed: float
    noise_level: float

@app.post("/predict")
def predict(data: List[SensorData]):
    # Convert list of SensorData to numpy array
    input_data = np.array([[getattr(d, col) for col in feature_columns] for d in data])

    # Predict classes
    class_preds = clf.predict(input_data)

    # Decode class labels
    class_labels = label_encoder.inverse_transform(class_preds)

    # Return list of maintenance predictions
    return class_labels.tolist()
