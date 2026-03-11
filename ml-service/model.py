import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self, contamination=0.05):
        # We use a default contamination rate of 5% (i.e. we expect 5% of data to be anomalous)
        self.model = IsolationForest(contamination=contamination, random_state=42)
    
    def process_data(self, data):
        """
        Process incoming data (list of dicts or 2D array) and return predictions.
        Assumes data is purely numerical for Isolation Forest.
        """
        try:
            df = pd.DataFrame(data)
            
            # Convert columns to numeric, forcing non-numbers to NaN
            for col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            
            # Keep only columns that have at least some valid numbers
            numeric_df = df.dropna(axis=1, how='all')
            # Fill any remaining internal NaNs with 0 to prevent IsolationForest from crashing
            numeric_df = numeric_df.fillna(0)
            
            if numeric_df.empty:
                return {
                    "error": "No numeric data found to perform anomaly detection.",
                    "debug_received_data_type": str(type(data)),
                    "debug_received_data_length": len(data),
                    "debug_received_first_row": data[0] if data else None,
                    "debug_columns": list(df.columns),
                }
            
            # Train and predict
            self.model.fit(numeric_df)
            predictions = self.model.predict(numeric_df)
            
            # IsolationForest returns -1 for anomalies, 1 for normal
            anomalies = (predictions == -1).astype(int)
            
            df['is_anomaly'] = anomalies
            
            # Find the indices of the anomalies
            anomaly_indices = df.index[df['is_anomaly'] == 1].tolist()
            
            return {
                "total_points": len(df),
                "anomalies_detected": int(sum(anomalies)),
                "anomaly_indices": anomaly_indices,
            }
            
        except Exception as e:
            return {"error": str(e)}
