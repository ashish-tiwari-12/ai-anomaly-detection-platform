import pandas as pd
from model import AnomalyDetector
import csv

detector = AnomalyDetector()

data = []
with open('../sample_anomaly_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

print("DATA LENGTH:", len(data))
result = detector.process_data(data)
print("RESULT:", result)
