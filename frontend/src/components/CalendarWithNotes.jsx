import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarWithNotes.css'
import Masonry from 'react-masonry-css';
import NoteList from './NoteList';

const CalendarWithNotes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [newNote, setNewNote] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderNotes = () => {
    const dateString = selectedDate.toDateString();
    return notes[dateString] ? (
      notes[dateString].map((note, index) => <div key={index} className="note">{note}</div>)
    ) : (
      <div>No notes for this date</div>
    );
  };

  const tileContent = ({ date, view }) => {
    const dateString = date.toDateString();
    if (view === 'month' && notes[dateString]) {
      return <div className="dot"></div>;
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-top">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
        />
      </div>
      <div className="notes-bottom">
        <h2>Notes for {selectedDate.toDateString()}</h2>
        <div className="notes-list">
          <NoteList />
        </div>
      </div>
    </div>
  );
};

export default CalendarWithNotes;
