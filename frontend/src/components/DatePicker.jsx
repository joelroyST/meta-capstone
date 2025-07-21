import React, { useState } from "react";
import DatePicker from "react-datepicker";
import './DatePicker.css'
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerComponent({ summaryFrequency, onDateRangeChange }) {
  const minStartDate = new Date("2021-10-20");
  const maxEndDate = new Date("2022-04-10");
  const [dateRange, setDateRange] = useState([minStartDate, null]);
  const [selectedStartDate, selectedEndDate] = dateRange;

  const handleChange = (dates) => {
    const [subscriptionStart, subscriptionEnd] = dates;
    setDateRange([subscriptionStart, subscriptionEnd]);
    if (subscriptionStart && subscriptionEnd && onDateRangeChange) {
        onDateRangeChange(subscriptionStart, subscriptionEnd);
    }
  };

  const filterEndDate = (date) => {
    if (!selectedStartDate) return true;

    const minValidEndDate = new Date(selectedStartDate);
    minValidEndDate.setDate(minValidEndDate.getDate()+summaryFrequency-1)
    return date >= minValidEndDate;
  }

  const handleReset = () => {
    setDateRange([minStartDate, null]);
  }

  return (
    <div>
      <DatePicker
        className="date-picker"
        selected={selectedStartDate}
        onChange={handleChange}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        selectsRange
        dateFormat="yyyy-MM-dd"
        minDate={minStartDate}
        maxDate={maxEndDate}
        filterDate={filterEndDate}
      />
      <button type="button" onClick={handleReset}>Reset</button>
    </div>
  );
}