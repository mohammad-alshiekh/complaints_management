"use client"; // Make sure this is at the top
import React, { PureComponent } from "react";
import ContaierTitle from "./TitleContainer";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

const data = [
  { name: "Mon", present: 44, absent: 12, amt: 2400 },
  { name: "Tue", present: 45, absent: 22, amt: 2210 },
  { name: "Thu", present: 43, absent: 31, amt: 2290 },
  { name: "Wed", present: 42, absent: 53, amt: 2000 },
  { name: "Fri", present: 41, absent: 21, amt: 2181 },
  { name: "Sut", present: 40, absent: 22, amt: 2500 },
  { name: "Sun", present: 39, absent: 53, amt: 2100 },
];

export default class AttendanceChart extends PureComponent {
  render() {
    return (
      <div className="w-full  rounded-lg bg-white h-[100%]">
        <ContaierTitle title="Attendaces" />
        <div className="  w-full h-[100%]">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart width={500} height={300} data={data} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ddd"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  borderColor: "lightgray",
                }}
              />
              <Legend
                align="left"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
              />
              <Bar
                dataKey="absent"
                fill="#faf27c"
                activeBar={<Rectangle fill="#faf27c" stroke="#faf27c" />}
              />
              <Bar
                dataKey="present"
                fill="#c3ebfa"
                activeBar={<Rectangle fill="#c3ebfa" stroke="#c3ebfa" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
