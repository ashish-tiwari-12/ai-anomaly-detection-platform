import pandas as pd
import numpy as np

data = [{"amount": "45.50", "time": "120"}, {"amount": "10000", "time": "2"}]
df = pd.DataFrame(data)

print("Original DF:\n", df)

for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

print("After to_numeric:\n", df)

numeric_df = df.dropna(axis=1, how='all')
numeric_df = numeric_df.fillna(0)

print("Numeric DF:\n", numeric_df)
print("Is Empty:", numeric_df.empty)
