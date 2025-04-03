import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the props type for TransactionItem
interface TransactionItemProps {
  date: string;
  day: string;
  type: string;
  total: string;
  amount: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ date, day, type, total, amount }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.dateCircle}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View>
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.totalText}>{total}</Text>
        <Text style={[styles.amountText, type === 'SALARY' ? styles.salaryText : styles.expenseText]}>
          {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  leftContainer: {
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
    fontSize: 12,
  },
  typeText: {
    color: '#000000',
    fontWeight: '600',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  totalText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
  },
  salaryText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
});

export default TransactionItem;
