const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const results = [];
fs.createReadStream('../sample_anomaly_data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    try {
      console.log("Sending data to ML service:", results.length, "rows");
      const response = await axios.post('http://127.0.0.1:5001/predict', { data: results });
      console.log("Success:", response.data);
    } catch (e) {
      console.error("ML Service Error Details:", e.response ? e.response.data : e.message);
    }
  });
