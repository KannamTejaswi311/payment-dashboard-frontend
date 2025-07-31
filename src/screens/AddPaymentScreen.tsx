import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addTransaction } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPayment'>;

const AddPaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [method, setMethod] = useState('upi');
  const [status, setStatus] = useState('success');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = async () => {
    if (!amount || !receiver || !method || !status) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newTransaction = {
      amount: parseFloat(amount),
      note,
      method,
      status,
      receiver,
    };

    try {
      setLoading(true);
      await addTransaction(newTransaction);
      Alert.alert('Success', 'Payment added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Add Payment Error:', error);
      Alert.alert('Error', 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Payment</Text>

      <TextInput
        placeholder="Amount (₹)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TextInput
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TextInput
        placeholder="Receiver"
        value={receiver}
        onChangeText={setReceiver}
        style={styles.input}
      />

      <Text style={styles.label}>Method</Text>
      <Picker selectedValue={method} onValueChange={setMethod} style={styles.picker}>
        <Picker.Item label="UPI" value="upi" />
        <Picker.Item label="Card" value="card" />
        <Picker.Item label="Netbanking" value="netbanking" />
        <Picker.Item label="Cash" value="cash" />
      </Picker>

      <Text style={styles.label}>Status</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
        <Picker.Item label="Success" value="success" />
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="Failed" value="failed" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Adding...' : 'Add Payment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
