import React, { useState } from "react";
import "./Calendar.css";

const Calendar = ({ selectedDate, onChange }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(selectedDate || today);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelected(newDate);
    if (onChange) onChange(newDate);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const isSelected = selected.getDate() === i && selected.getMonth() === currentMonth && selected.getFullYear() === currentYear;
      days.push(
        <div
          key={i}
          className={`day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{`${currentMonth+1} - ${currentYear}`}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="days" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="empty"></div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
