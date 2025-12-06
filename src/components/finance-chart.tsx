"use client"; 
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
} from "recharts";

const data = [
  { name: "Mon", income: 44, expense: 12, amt: 2400 },
  { name: "Tue", income: 45, expense: 22, amt: 2210 },
  { name: "Thu", income: 43, expense: 31, amt: 2290 },
  { name: "Wed", income: 42, expense: 53, amt: 2000 },
  { name: "Fri", income: 41, expense: 21, amt: 2181 },
  { name: "Sut", income: 40, expense: 22, amt: 2500 },
  { name: "Sun", income: 39, expense: 53, amt: 2100 },
];
const FinanceChart = () => {
  return (
    <div className="w-full rounded-lg bg-white h-[500px] p-4">
      <ContaierTitle title="Attendaces" />
      <div className="  w-full h-[100%]">
        <ResponsiveContainer width="100%" height="90%">
          <LineChart width={500} height={300} data={data} barSize={20}>
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
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
            />
            <Tooltip />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <CartesianGrid strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#c3ebfa"
              strokeWidth={5}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#cfceff"
              strokeWidth={5}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default FinanceChart;
