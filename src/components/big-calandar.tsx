"use client";
import React, { useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { calendarEvents } from "@/lib/data";

const localizer = momentLocalizer(moment);

const ComplianceCalender = () => {
  const [events, setEvents] = useState<View>("week");

  const handleOnChandgeView = (selectedView: View) => {
    setEvents(selectedView);
  };
  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      defaultDate={new Date(2024, 7, 12)}
      onView={handleOnChandgeView}
      view={events}
      style={{ height: "100%" }}
      views={["week", "day"]}
    />
  );
};

export default ComplianceCalender;
