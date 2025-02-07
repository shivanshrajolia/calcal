import React, { useState } from 'react';
import './TimeBar.css';

const TimeBar = ({ selectedDate, onChange }) => {
  const currentDate = new Date();
  const [selected, setSelected] = useState(selectedDate || currentDate);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  // Generate past 12 weeks including the current week
  const getPastWeeks = () => {
    const weeks = [];
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - i * 7 - ((currentDate.getDay() + 6) % 7)); // Adjust to Monday
      const weekDates = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        weekDates.push(new Date(day.setHours(0, 0, 0, 0))); // Set time to midnight
      }
      weeks.push(weekDates);
    }
    return weeks;
  };

  const weeks = getPastWeeks();

  const handleDateClick = (day) => {
    const newDate = new Date(day);
    setSelected(new Date(newDate.setHours(0, 0, 0, 0))); // Set time to midnight
    if (onChange) onChange(new Date(newDate.setHours(0, 0, 0, 0))); // Set time to midnight
  };

  const handlePrevWeek = () => {
    setCurrentWeekIndex((prev) => Math.min(prev + 1, weeks.length - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="time-bar-container">
      <button className="nav-button" onClick={handlePrevWeek}>&lt;</button>
      <div className="time-bar">
        {weeks[currentWeekIndex].map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`day-item ${selected.toDateString() === day.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day.toDateString().slice(0,10)}
          </div>
        ))}
      </div>
      <button className="nav-button" onClick={handleNextWeek}>&gt;</button>
    </div>
  );
};

export default TimeBar;