import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import CalendarComponent from './components/CalendarComponent';
import TransactionItem from './components/TransactionItem';

// Define the type for a transaction
interface Transaction {
  date: string;
  day: string;
  type: string;
  amount: string;
  total: string;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2021-08-29');

  // Sample transaction data for August 29, 2021
  const transactions: Transaction[] = [
    { date: '29', day: 'Wed', type: 'BUY GAMES', amount: '-$2,442.10', total: '$45,678.90' },
    { date: '29', day: 'Wed', type: 'SALARY', amount: '+$20,000.00', total: '$45,678.90' },
    { date: '29', day: 'Wed', type: 'BUY GAMES', amount: '-$2,442.10', total: '$45,678.90' },
    { date: '29', day: 'Wed', type: 'BUY GAMES', amount: '-$2,442.10', total: '$45,678.90' },
    { date: '29', day: 'Wed', type: 'BUY GAMES', amount: '-$2,442.10', total: '$45,678.90' },
  ];

  // Handle date selection
  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* Calendar Section */}
      <CalendarComponent selectedDate={selectedDate} onDayPress={onDayPress} />

      {/* Transactions List */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            date={transaction.date}
            day={transaction.day}
            type={transaction.type}
            total={transaction.total}
            amount={transaction.amount}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
