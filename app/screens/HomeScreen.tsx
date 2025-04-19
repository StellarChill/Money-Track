import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Alert, Text, Button, TextInput, Switch, Modal, TouchableOpacity, ScrollView } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import TransactionItem from '../components/TransactionItem';
import MonthlySummary from '../components/MonthlySummary';
import styles from './HomeScreen.styles';
import MonthTab from '../tabs/MonthTab'; // นำเข้า MonthTab

interface TransactionItemProps {
  id: number;
  date: string;
  day: string;
  type: string;
  amount: string;
  description: string;
  isIncome: boolean;
}

const API_URL = "https://breezy-clowns-brush.loca.lt/api/transactions";

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-01"); // Set to first day of selected month initially
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false); // State สำหรับ trigger การ refresh

  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isIncome, setIsIncome] = useState<boolean>(false);

  const fetchTransactions = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}?date=${date}`);
      if (response.ok) {
        const data: TransactionItemProps[] = await response.json();
        // กรองเฉพาะ transaction ที่ตรงกับวันที่ที่เลือก
        const filteredTransactions = data.filter(
          (transaction) => transaction.date.split('T')[0] === date
        );
        setTransactions(filteredTransactions);
  
        const newMarkedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
        filteredTransactions.forEach((transaction) => {
          const transactionDate = transaction.date.split('T')[0];
          newMarkedDates[transactionDate] = { marked: true, dotColor: '#00adf5' };
        });
        setMarkedDates(newMarkedDates);
      } else {
        Alert.alert('Error', 'Failed to fetch transactions.');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'An error occurred while fetching transactions.');
    }
  };

  const addTransaction = async () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const newTransaction = {
        description,
        amount: parseFloat(amount),
        date: new Date(selectedDate).toISOString(),
        isIncome,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        setDescription('');
        setAmount('');
        setIsIncome(false);
        setIsModalVisible(false);
        fetchTransactions(selectedDate);
        setRefreshTrigger((prev) => !prev); // Trigger refresh
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        Alert.alert('Error', `Failed to add transaction: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'An error occurred while adding the transaction.');
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTransactions(selectedDate);
        setRefreshTrigger((prev) => !prev); // Trigger refresh
      } else {
        Alert.alert('Error', 'Failed to delete transaction.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'An error occurred while deleting the transaction.');
    }
  };

  useEffect(() => {
    fetchTransactions(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.calendarSection}>
          <CalendarComponent
            selectedDate={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
          />
        </View>

        <View style={styles.summarySection}>
          <MonthlySummary
            selectedDate={selectedDate}
            onMonthChange={(newMonth) => setSelectedDate(newMonth.toISOString().split('T')[0])}
            transactions={transactions}
          />
        </View>

        {/* เพิ่ม MonthTab */}
        <View>
          <MonthTab selectedMonth={selectedDate.slice(0, 7)} refreshTrigger={refreshTrigger} /> {/* ส่งเฉพาะปีและเดือน */}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Transaction</Text>
        </TouchableOpacity>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <TransactionItem
                  date={item.date}
                  day={new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  type={item.isIncome ? 'Income' : 'Expense'}
                  amount={item.amount}
                />
                <View style={styles.transactionActions}>
                  <Text>{item.description} - {item.amount}</Text>
                  <Button title="Delete" onPress={() => deleteTransaction(item.id)} />
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No transactions available</Text>
            )}
          />
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.formTitle}>Add Transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <View style={styles.switchContainer}>
              <Text>Is Income?</Text>
              <Switch value={isIncome} onValueChange={setIsIncome} />
            </View>
            <Button title="Add Transaction" onPress={addTransaction} />
            <Button title="Cancel" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;