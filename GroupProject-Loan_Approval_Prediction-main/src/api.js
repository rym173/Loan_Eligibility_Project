import axios from 'axios';

const fetchPrediction = async (data) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', data);
    console.log("Prediction response:", response.data);
    print('hi')
    return response.data.prediction;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    print('error')
    return null;
  }
};

export default fetchPrediction;
