import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';

interface CalendarComponentProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, onDayPress }) => {
  const calendarTheme: CalendarProps['theme'] = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'black',
    monthTextColor: 'black',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#00adf5' },
        }}
        theme={calendarTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },
});

export default CalendarComponent;