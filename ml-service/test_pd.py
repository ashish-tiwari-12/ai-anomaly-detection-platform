import pandas as pd
import numpy as np
import json

data = [{"amount": "45.50", "time": "120"}, {"amount": "10000", "time": "2"}]
df = pd.DataFrame(data)
df = df.apply(pd.to_numeric, errors='ignore')

numeric_df = df.select_dtypes(include=[np.number])
print("TYPES:", df.dtypes)
print("NUMERIC:", numeric_df.columns)
