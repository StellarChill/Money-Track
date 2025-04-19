import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './MonthlySummary.styles';

interface TransactionItemProps {
  id: number;
  date: string;
  day: string;
  type: string;
  amount: string;
  description: string;
  isIncome: boolean;
}

interface MonthlySummaryProps {
  selectedDate: string;
  onMonthChange: (newMonth: Date) => void;
  transactions: TransactionItemProps[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  selectedDate,
  onMonthChange,
  transactions,
}) => {
  const selectedMonth = new Date(selectedDate);
  selectedMonth.setDate(1);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const displayMonth = `${months[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + (direction === 'next' ? 1 : -1));
    onMonthChange(newDate);
  };

  const getMonthlySummary = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getFullYear() === year &&
        transactionDate.getMonth() === month
      ) {
        const amount = parseFloat(transaction.amount);
        if (transaction.isIncome) {
          income += amount;
        } else {
          expense += amount;
        }
      }
    });

    const finalBalance = income - expense;

    return {
      income: income.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      expense: expense.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      total: finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  };

  const { income, expense, total } = getMonthlySummary();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{displayMonth}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.summaryLabel}>Final Balance</Text>
          <Text style={[styles.summaryValue, total.startsWith('-') ? styles.expenseText : styles.incomeText]}>
            {total}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MonthlySummary;
