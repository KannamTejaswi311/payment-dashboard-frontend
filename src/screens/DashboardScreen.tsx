import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import RevenueChart from '../components/RevenueChart';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const [stats, setStats] = useState<{
    totalPayments: number;
    todaysPayments: number;
    totalAmount: number;
  } | null>(null);

  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetching stats with token:', token);

      const [statsRes, chartRes] = await Promise.all([
        axios.get('http://10.45.52.96:3000/payments/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://10.45.52.96:3000/payments/chart', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data);
      setChartLabels(chartRes.data.labels);   // e.g., ['Mon', 'Tue', ...]
      setChartData(chartRes.data.data);       // e.g., [100, 200, 300, ...]
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    // AppNavigator will auto-redirect to Login
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {stats ? (
        <View style={styles.statsBox}>
          <Text style={styles.statText}>Total Payments: {stats.totalPayments}</Text>
          <Text style={styles.statText}>Today’s Payments: {stats.todaysPayments}</Text>
          <Text style={styles.statText}>Total Amount: ₹{stats.totalAmount}</Text>

          <RevenueChart
            labels={chartLabels}
            data={chartData}
          />

          <View style={styles.buttonContainer}>
            <Button title="View Transactions" onPress={() => navigation.navigate('TransactionList')} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Logout" color="red" onPress={handleLogout} />
          </View>
        </View>
      ) : (
        <Text style={{ color: 'red', textAlign: 'center' }}>Failed to load stats.</Text>
      )}
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsBox: {
    alignItems: 'center',
    gap: 10,
  },
  statText: {
    fontSize: 18,
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});
