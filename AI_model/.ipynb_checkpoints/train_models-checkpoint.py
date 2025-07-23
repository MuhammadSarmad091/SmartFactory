# train_models.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Step 1: Load dataset
print("[1/6] Loading dataset...")
df = pd.read_csv("machine_dataset.csv")

# Step 2: Prepare data
print("[2/6] Preparing data...")

# Extract features and label
features = ['temperature', 'vibration', 'power_usage', 
            'production_speed',  'noise_level']
label = 'maintenance'

X = df[features]
y = df[label]

# Encode labels (e.g., 0: No maintenance, 1: Maintenance required)
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Step 3: Train-test split
print("[3/6] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Step 4: Train classification model
print("[4/6] Training classifier (RandomForest)...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
print(f"Classifier training completed. Accuracy on train set: {clf.score(X_train, y_train):.2f}")

# Step 5: Train anomaly detector
print("[5/6] Training anomaly detector (IsolationForest)...")
iso = IsolationForest(contamination=0.05, random_state=42)
iso.fit(X[features])
print("Anomaly detection model trained.")

# Step 6: Save models
print("[6/6] Saving models to 'models/' folder...")
os.makedirs("models", exist_ok=True)
with open("models/classifier.pkl", "wb") as f:
    pickle.dump(clf, f)
with open("models/anomaly_detector.pkl", "wb") as f:
    pickle.dump(iso, f)
with open("models/encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("✅ All models saved successfully!")
