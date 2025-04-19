import { StyleSheet } from 'react-native';

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
    flexWrap: 'wrap',
  },
  summaryItem: {
    alignItems: 'center',
    marginVertical: 8,
    flex: 1,
    minWidth: '25%',
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
  expenseText: {
    color: '#EF4444',
  },
  incomeText: {
    color: '#10B981',
  },
});

export default styles;