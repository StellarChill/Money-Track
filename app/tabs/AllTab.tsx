import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import styles from './AllTab.styles';
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


const AllTab = ({ refreshTrigger }: { refreshTrigger: boolean }) => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [finalBalance, setFinalBalance] = useState<number>(0);

  const fetchAllSummary = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data: TransactionItemProps[] = await response.json();

        let totalIncome = 0;
        let totalExpenses = 0;

        data.forEach((transaction) => {
          const amount = parseFloat(transaction.amount);
          if (transaction.isIncome) {
            totalIncome += amount;
          } else {
            totalExpenses += amount;
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);
        setFinalBalance(totalIncome - totalExpenses);
      } else {
        Alert.alert('Error', 'Failed to fetch transactions.');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'An error occurred while fetching transactions.');
    }
  };

  useEffect(() => {
    fetchAllSummary();
  }, [refreshTrigger]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary for All Transactions</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>
            {income.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, styles.expenseText]}>
            -{expenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Final Balance</Text>
          <Text
            style={[
              styles.summaryValue,
              finalBalance < 0 ? styles.expenseText : styles.incomeText,
            ]}
          >
            {finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AllTab;