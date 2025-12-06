"use client";
import React, { PureComponent } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ContaierTitle from "./TitleContainer";
import Image from "next/image"; //+

const data = [
  {
    name: "Total",
    count: 108,
    fill: "white",
  },
  {
    name: "Boys",
    count: 55,
    fill: "#C3ebfa",
  },
  {
    name: "Girls",
    count: 45,
    fill: "#fae27c",
  },
];

export default class CountChart extends PureComponent {
  render() {
    return (
      <div className="w-full h-[100%]">
        <ContaierTitle title="student 2" />
        <div className=" relative w-full h-[75%]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={20}
              data={data}
            >
              <RadialBar background dataKey="count" />
            </RadialBarChart>
          </ResponsiveContainer>
          <Image
            alt="logo"
            src="/maleFemale.png"
            width={45}
            height={45}
            className="absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2"
          />
        </div>

        <div className="flex  gap-16 justify-center ">
          <div className="flex flex-col gap-1">
            <div className="rounded-full h-5 w-5 bg-yellowx"></div>
            <h1 className="font-bold">1,214</h1>
            <h2 className="text-xs text-gray-300">Boys 55%</h2>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-full h-5 w-5 bg-cyanx"></div>
            <h1 className="font-bold">1,214</h1>
            <h2 className="text-xs text-gray-300">Girls 55%</h2>
          </div>
        </div>
      </div>
    );
  }
}
