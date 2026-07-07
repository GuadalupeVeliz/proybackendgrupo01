const axios = require('axios');

async function getChartImageBuffer(chartConfig, width = 500, height = 300) {
  const response = await axios.post(
    'https://quickchart.io/chart',
    {
      chart: chartConfig,
      width,
      height,
      backgroundColor: 'white',
    },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(response.data);
}

module.exports = { getChartImageBuffer };