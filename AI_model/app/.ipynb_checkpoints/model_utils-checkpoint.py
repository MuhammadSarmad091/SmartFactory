import joblib

def load_models():
    clf = joblib.load("models/classifier.pkl")
    anomaly_model = joblib.load("models/anomaly_detector.pkl")
    label_encoder = joblib.load("models/encoder.pkl")
    return clf, anomaly_model, label_encoder
