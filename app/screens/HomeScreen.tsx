import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Alert, Text, Button, TextInput, Switch, Modal, TouchableOpacity, ScrollView } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import TransactionItem from '../components/TransactionItem';
import MonthlySummary from '../components/MonthlySummary';

interface TransactionItemProps {
  id: number;
  date: string;
  day: string;
  type: string;
  amount: string;
  description: string;
  isIncome: boolean;
}

const API_URL = "https://ripe-dolls-marry.loca.lt/api/transactions"; // ใช้ LocalTunnel URL

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-17");
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // State สำหรับฟอร์ม
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isIncome, setIsIncome] = useState<boolean>(false);

  // Fetch transactions for the selected date
  const fetchTransactions = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}?date=${date}`);
      if (response.ok) {
        const data: TransactionItemProps[] = await response.json();

        // กรองข้อมูลเฉพาะวันที่ที่เลือก
        const filteredTransactions = data.filter(
          (transaction) => transaction.date.split('T')[0] === date
        );

        setTransactions(filteredTransactions); // Set only transactions for the selected date

        // อัปเดต markedDates สำหรับปฏิทิน
        const newMarkedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
        data.forEach((transaction) => {
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

  // Add a new transaction
  const addTransaction = async () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const newTransaction = {
        description,
        amount: parseFloat(amount), // แปลง amount จาก string เป็น number
        date: new Date(selectedDate).toISOString(), // ใช้ selectedDate และแปลงเป็น ISO 8601
        isIncome,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        setDescription(''); // Reset form fields
        setAmount('');
        setIsIncome(false);
        setIsModalVisible(false); // ปิด Modal หลังจากเพิ่มสำเร็จ
        fetchTransactions(selectedDate); // Refresh transactions after adding
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

  // Delete a transaction
  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTransactions(selectedDate); // Refresh transactions after deletion
      } else {
        Alert.alert('Error', 'Failed to delete transaction.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'An error occurred while deleting the transaction.');
    }
  };

  useEffect(() => {
    fetchTransactions(selectedDate); // Fetch transactions for the selected date
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Calendar */}
        <View style={styles.calendarSection}>
          <CalendarComponent
            selectedDate={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
          />
        </View>

        {/* Monthly Summary */}
        <View style={styles.summarySection}>
          <MonthlySummary
            selectedDate={selectedDate}
            onMonthChange={(newMonth) => setSelectedDate(newMonth.toISOString().split('T')[0])}
            transactionData={{}} // Replace with actual data
            balance={50000} // Replace with actual balance
          />
        </View>

        {/* Add Transaction Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Transaction</Text>
        </TouchableOpacity>

        {/* Transactions Section */}
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

      {/* Add Transaction Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  calendarSection: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summarySection: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  listContainer: {
    paddingBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default HomeScreen;