// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import TransactionItem from '../components/TransactionItem';
import MonthlySummary from '../components/MonthlySummary';

interface TransactionItemProps {
  date: string;
  day: string;
  type: string;
  total: string;
  amount: string;
}

const transactionData: { [key: string]: TransactionItemProps[] } = {
  '2025-04-17': [
    { date: '17', day: 'Thu', type: 'Salary', total: '$5,000.00', amount: '+$5,000.00' },
  ],
  '2025-04-18': [
    { date: '18', day: 'Fri', type: 'Shopping', total: '$120.00', amount: '-$120.00' },
  ],
};

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-17");
  const initialBalance = 50000;

  const calculateBalanceUpToPreviousMonth = (selectedDate: string): number => {
    const selected = new Date(selectedDate);
    const selectedYear = selected.getFullYear();
    const selectedMonth = selected.getMonth() + 1;

    let balance = initialBalance;
    const sortedDates = Object.keys(transactionData).sort();

    for (const date of sortedDates) {
      const [year, month] = date.split('-').map(Number);
      if (year < selectedYear || (year === selectedYear && month < selectedMonth)) {
        const transactions = transactionData[date];
        transactions.forEach((transaction) => {
          const amount = parseFloat(transaction.amount.replace(/[$+]/g, ''));
          balance += transaction.amount.startsWith('+') ? amount : -Math.abs(amount);
        });
      }
    }

    return balance;
  };

  const handleMonthChange = (newMonth: Date) => {
    const newDate = new Date(newMonth);
    newDate.setDate(1);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const balanceUpToPreviousMonth = calculateBalanceUpToPreviousMonth(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <CalendarComponent selectedDate={selectedDate} onDayPress={(day) => setSelectedDate(day.dateString)} />
      <MonthlySummary selectedDate={selectedDate} onMonthChange={handleMonthChange} transactionData={transactionData} balance={balanceUpToPreviousMonth} />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={transactionData[selectedDate] || []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TransactionItem date={item.date} day={item.day} type={item.type} amount={item.amount} />
        )}
        ListEmptyComponent={() => (
          <TransactionItem date="No" day="Transactions" type="N/A" amount="$0.00" />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default HomeScreen;
