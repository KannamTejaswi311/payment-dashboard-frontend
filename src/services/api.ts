import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.45.52.96:3000'; // your backend IP

// ✅ Login Function
export const login = async (username: string, password: string): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    username,
    password,
  });

  console.log('Login response:', response.data);
  return response.data.access_token;
};

// ✅ Get Transactions Function
export const getTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// ✅ Add Transaction Function
export const addTransaction = async (transaction: { amount: number; note: string }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/payments`, transaction, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};
