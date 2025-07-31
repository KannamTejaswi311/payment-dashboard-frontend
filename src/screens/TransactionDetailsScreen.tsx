import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type Transaction = {
  _id: string;
  amount: number;
  createdAt: string;
  note: string;
};

type TransactionDetailsRouteProp = RouteProp<
  { TransactionDetails: { transaction: Transaction } },
  'TransactionDetails'
>;

const TransactionDetailsScreen = () => {
  const route = useRoute<TransactionDetailsRouteProp>();
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{transaction._id}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{transaction.amount}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(transaction.createdAt).toLocaleString()}
        </Text>

        <Text style={styles.label}>Note:</Text>
        <Text style={styles.value}>{transaction.note}</Text>
      </View>
    </View>
  );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
