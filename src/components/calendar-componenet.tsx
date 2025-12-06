"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ContaierTitle from "./TitleContainer";

type valuePiece = Date | null;
type value = valuePiece | [valuePiece, valuePiece];

const enents = [
  {
    id: 1,
    title: "loren impsu dolor",
    time: "12:12pm",
    description: "dfsj asdfjlksfd  slkdjfjdsfj lkdsjflkds",
  },
  {
    id: 2,
    title: "loren impsu dolor",
    time: "12:12pm",
    description: "dfsj asdfjlksfd  slkdjfjdsfj lkdsjflkds",
  },
  {
    id: 3,
    title: "loren impsu dolor",
    time: "12:12pm",
    description: "dfsj asdfjlksfd  slkdjfjdsfj lkdsjflkds",
  },
  {
    id: 4,
    title: "loren impsu dolor",
    time: "12:12pm",
    description: "dfsj asdfjlksfd  slkdjfjdsfj lkdsjflkds",
  },
];
const CalendarCompeonet = () => {
  const [value, onChange] = useState<value>(new Date());
  return (
    <div className="bg-white p-4 rounded-xl">
      <Calendar onChange={onChange} value={value} />
      <div
        className={`flex flex-col bg-white rounded-xl justify-between min-w-[340px] px-2`}
      >
        <ContaierTitle title="Student" />
        <div className="flex flex-col gap-4"></div>
        {enents.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-md border-gray-100 border-t-4 odd:border-t-cyanx even:border-t-purplex"
          >
            <div className="flex items-center justify-between ">
              <h1 className="font-semibold text-sm text-gray-600">
                {item.title}
              </h1>
              <span className=" text-xs text-gray-300">{item.time}</span>
            </div>
            <p className=" text-sm mt-2 text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CalendarCompeonet;
