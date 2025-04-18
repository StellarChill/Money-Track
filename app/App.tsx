import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import CalendarComponent from './components/CalendarComponent';
import TransactionItem from './components/TransactionItem';
import MonthlySummary from './components/MonthlySummary';

// Define the TransactionItemProps interface
interface TransactionItemProps {
  date: string;
  day: string;
  type: string;
  total: string;
  amount: string;
}

// Sample transaction data (in English)
const transactionData: { [key: string]: TransactionItemProps[] } = {
  '2025-04-17': [
    {
      date: '17',
      day: 'Thu',
      type: 'Salary',
      total: '$5,000.00',
      amount: '+$5,000.00',
    },
  ],
  '2025-04-18': [
    {
      date: '18',
      day: 'Fri',
      type: 'Shopping',
      total: '$120.00',
      amount: '-$120.00',
    },
  ],
};

const App: React.FC = () => {
  // Initialize selectedDate to a date with transactions (April 17, 2025)
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-17");

  // Initial balance (starting point)
  const initialBalance = 50000;

  // Function to calculate balance up to the end of the previous month
  const calculateBalanceUpToPreviousMonth = (selectedDate: string): number => {
    const selected = new Date(selectedDate);
    const selectedYear = selected.getFullYear();
    const selectedMonth = selected.getMonth() + 1; // JavaScript months are 0-based

    let balance = initialBalance;

    // Sort dates to process transactions chronologically
    const sortedDates = Object.keys(transactionData).sort();

    for (const date of sortedDates) {
      const [year, month] = date.split('-').map(Number);
      // Only consider transactions before the selected month
      if (year < selectedYear || (year === selectedYear && month < selectedMonth)) {
        const transactions = transactionData[date];
        transactions.forEach((transaction) => {
          const amount = parseFloat(transaction.amount.replace(/[$+]/g, ''));
          if (transaction.amount.startsWith('+')) {
            balance += amount;
          } else {
            balance -= Math.abs(amount);
          }
        });
      }
    }

    return balance;
  };

  // Function to update selectedDate when month changes
  const handleMonthChange = (newMonth: Date) => {
    const newDate = new Date(newMonth);
    newDate.setDate(1);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  // Calculate the balance up to the previous month
  const balanceUpToPreviousMonth = calculateBalanceUpToPreviousMonth(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <CalendarComponent
        selectedDate={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <MonthlySummary
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
        transactionData={transactionData}
        balance={balanceUpToPreviousMonth}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={transactionData[selectedDate] || []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            date={item.date}
            day={item.day}
            type={item.type}
            amount={item.amount}
          />
        )}
        ListEmptyComponent={() => (
          <TransactionItem
            date="No"
            day="Transactions"
            type="N/A"
            amount="$0.00"
          />
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

export default App;