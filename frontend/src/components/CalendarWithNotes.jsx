import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarWithNotes.css'
import Masonry from 'react-masonry-css';
import NoteList from './NoteList';
import { useDispatch, useSelector } from 'react-redux';
import { initializeNote } from '../reducers/noteReducer';

const CalendarWithNotes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes)
  const dates = notes.map(note => note.calendarDate).map(date => {
    const convertedDate = new Date(date)
    return convertedDate.toDateString()
  })

  useEffect(() => {
    if (notes.length === 0) {
      dispatch(initializeNote())
    }
  }, [])

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString()
      const hasNote = dates?.some(date => date === dateString)
      return hasNote ? <div className="dot"></div> : null
    }
    return null
  }

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
          <NoteList currentDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default CalendarWithNotes;
