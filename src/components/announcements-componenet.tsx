"use client"; // Make sure this is at the top
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import ContaierTitle from "./TitleContainer";

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
];
const AnnouncementsComponent = () => {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl my-3 justify-between min-w-[340px] px-2 py-3`}
    >
      <ContaierTitle title="Announcements" />
      <div className="flex flex-col gap-4 mt-3"></div>
      {enents.map((item) => (
        <div
          key={item.id}
          className="p-5 mb-3 rounded-md odd:bg-purplelightx even:bg-cyanlightx"
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
  );
};
export default AnnouncementsComponent;
