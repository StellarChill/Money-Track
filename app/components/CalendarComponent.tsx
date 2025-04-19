import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, FlatList, Text, Alert } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';

interface CalendarComponentProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
}

interface Event {
  id: number;
  description: string;
  amount: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, onDayPress }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events for the selected date
  const fetchEvents = async (date: string) => {
    try {
      const response = await fetch(`http://localhost:3000/events?date=${date}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Add a new event
  const addEvent = async () => {
    try {
      const newEvent = { description: 'New Event', amount: '+100', date: selectedDate };
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (response.ok) {
        fetchEvents(selectedDate); // Refresh events
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Delete an event
  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchEvents(selectedDate); // Refresh events
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => {
          onDayPress(day);
          fetchEvents(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#00adf5' },
        }}
        theme={{
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
        }}
      />
      <Button title="Add Event" onPress={addEvent} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text>{item.description} - {item.amount}</Text>
            <Button title="Delete" onPress={() => deleteEvent(item.id)} />
          </View>
        )}
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
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
});

export default CalendarComponent;