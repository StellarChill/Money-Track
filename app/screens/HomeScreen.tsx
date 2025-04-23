import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView,View,Alert,Text,Button,TextInput,Switch,Modal,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import TransactionItem from '../components/TransactionItem';
import DaylySummary from '../components/DaylySummary';
import styles from './HomeScreen.styles';
import MonthTab from '../tabs/MonthTab';
import AllTab from '../tabs/AllTab';
import { API_URL } from '../../constants/api'; 

interface TransactionItemProps {
  id: number;
  date: string;
  day: string;
  type: string;
  amount: string;
  description: string;
  isIncome: boolean;
}

const PAGE_SIZE = 10;


const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isIncome, setIsIncome] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchTransactions = useCallback(async (reset = false) => {
    try {
      if (isLoading) return;

      setIsLoading(true);
      const response = await fetch(`${API_URL}?date=${selectedDate}&page=${reset ? 1 : page}&limit=${PAGE_SIZE}`);
      if (response.ok) {
        const data: TransactionItemProps[] = await response.json();
        const filtered = data.filter(
          (transaction) => transaction.date.split('T')[0] === selectedDate
        );

        if (reset) {
          setTransactions(filtered);
        } else {
          setTransactions((prev) => [...prev, ...filtered]);
        }

        const newMarked: { [key: string]: { marked: boolean; dotColor: string } } = {};
        filtered.forEach((t) => {
          const dateKey = t.date.split('T')[0];
          newMarked[dateKey] = { marked: true, dotColor: '#00adf5' };
        });
        setMarkedDates((prev) => ({ ...prev, ...newMarked }));

        if (filtered.length < PAGE_SIZE) setHasMore(false);
        else setHasMore(true);
      } else {
        Alert.alert('Error', 'Failed to fetch transactions.');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'An error occurred while fetching transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedDate, isLoading]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchTransactions(true);
  }, [selectedDate]);

  useEffect(() => {
    if (page > 1) {
      fetchTransactions();
    }
  }, [page]);

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
        setPage(1);
        fetchTransactions(true);
        setRefreshTrigger((prev) => !prev);
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
        setPage(1);
        fetchTransactions(true);
        setRefreshTrigger((prev) => !prev);
      } else {
        Alert.alert('Error', 'Failed to delete transaction.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'An error occurred while deleting the transaction.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.calendarSection}>
              <CalendarComponent
                selectedDate={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
              />
            </View>


            <MonthTab selectedMonth={selectedDate.slice(0, 7)} refreshTrigger={refreshTrigger} />
            <View style={styles.summarySection}>
              <DaylySummary
                selectedDate={selectedDate}
                onMonthChange={(newMonth) => setSelectedDate(newMonth.toISOString().split('T')[0])}
                transactions={transactions}
              />
            </View>
            <AllTab refreshTrigger={refreshTrigger} />

            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addButtonText}>+ Add Transaction</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Transactions</Text>
          </>
        }
        contentContainerStyle={styles.listContainer}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionDay}>
                {new Date(item.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={item.isIncome ? styles.transactionAmount : styles.transactionAmountExpense}>
                {item.isIncome ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionText}>{item.description}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTransaction(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => isLoading && <ActivityIndicator size="small" color="#0000ff" />}
        ListEmptyComponent={() => !isLoading && <Text style={styles.emptyText}>No transactions available</Text>}
      />

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
