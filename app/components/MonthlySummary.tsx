import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// Interface for TransactionItemProps (used in transactionData)
interface TransactionItemProps {
  date: string;
  day: string;
  type: string;
  total: string;
  amount: string;
}

interface Transaction {
  type: string;
  amount: string;
}

interface DailySummary {
  date: string;
  day: string;
  transactions: Transaction[];
}

// Interface for props of MonthlySummary
interface MonthlySummaryProps {
  selectedDate: string; // Date selected from CalendarComponent
  onMonthChange: (newMonth: Date) => void; // Function to update month when changed
  transactionData: { [key: string]: TransactionItemProps[] }; // Transaction data
  balance: number; // Balance up to the end of the previous month
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ selectedDate, onMonthChange, transactionData, balance }) => {
  // Set selectedMonth from selectedDate
  const selectedMonth = new Date(selectedDate);
  selectedMonth.setDate(1); // Set to the 1st of the month for calculation

  // Define month names and days in English
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Display month and year in English
  const displayMonth = `${months[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;

  // Function to change month
  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + (direction === 'next' ? 1 : -1));
    onMonthChange(newDate); // Update month via callback
  };

  // Calculate monthly summary of income and expenses for the current month
  const getMonthlySummary = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;

    let income = 0;
    let expense = 0;
    const dailySummaries: { [key: string]: DailySummary } = {};

    Object.keys(transactionData).forEach((date) => {
      if (date.startsWith(monthStr)) {
        const transactions = transactionData[date];
        transactions.forEach((transaction) => {
          // Remove $, +, and commas from the amount string before parsing
          const amount = parseFloat(transaction.amount.replace(/[$+,]/g, ''));
          if (transaction.amount.startsWith('+')) {
            income += amount; // Add to monthly income
          } else {
            expense += Math.abs(amount); // Add to monthly expenses
          }

          if (!dailySummaries[date]) {
            const dayOfWeek = days[new Date(date).getDay()];
            dailySummaries[date] = {
              date: date.split('-')[2],
              day: dayOfWeek,
              transactions: [],
            };
          }

          // Add the transaction to the day's transactions list
          dailySummaries[date].transactions.push({
            type: transaction.type,
            amount: transaction.amount,
          });
        });
      }
    });

    const dailySummaryArray = Object.keys(dailySummaries)
      .map((date) => dailySummaries[date])
      .sort((a, b) => parseInt(b.date) - parseInt(a.date));

    // Calculate intermediate balance (after income, before expenses)
    const balanceAfterIncome = balance + income;
    // Calculate final balance (after income and expenses)
    const finalBalance = balance + income - expense;

    return {
      income: income.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      expense: expense.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      balanceAfterIncome: balanceAfterIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      total: finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      dailySummaries: dailySummaryArray,
    };
  };

  const { income, expense, balanceAfterIncome, total, dailySummaries } = getMonthlySummary();

  const renderDailySummary = ({ item }: { item: DailySummary }) => (
    <View style={styles.dailyItem}>
      <View style={styles.dateContainer}>
        <View style={styles.dateCircle}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <Text style={styles.dayText}>{item.day}</Text>
      </View>
      <View style={styles.amountContainer}>
        {item.transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionRow}>
            <Text style={styles.transactionType}>{transaction.type}</Text>
            <Text
              style={[
                styles.transactionAmount,
                transaction.amount.startsWith('+') ? styles.incomeText : styles.expenseText,
              ]}
            >
              {transaction.amount}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header for month selection */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{displayMonth}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>{income}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, styles.expenseText]}>-{expense}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Balance Before Expenses</Text>
          <Text style={styles.summaryValue}>{balanceAfterIncome}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Final Balance</Text>
          <Text style={[styles.summaryValue, total.startsWith('-') ? styles.expenseText : styles.incomeText]}>{total}</Text>
        </View>
      </View>

      {/* Daily Summaries */}
      <FlatList
        data={dailySummaries}
        renderItem={renderDailySummary}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  arrow: {
    fontSize: 24,
    color: '#000000',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    flexWrap: 'wrap', // Allow wrapping for additional items
  },
  summaryItem: {
    alignItems: 'center',
    marginVertical: 8,
    flex: 1,
    minWidth: '25%', // Ensure items don't get too narrow
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dayText: {
    color: '#6B7280',
    fontSize: 14,
  },
  amountContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  transactionType: {
    color: '#6B7280',
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default MonthlySummary;