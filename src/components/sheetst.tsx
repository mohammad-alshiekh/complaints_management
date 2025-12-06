// components/TeachersTable.js
import React from "react";

const teachersData = [
  {
    id: "T001",
    name: "John Doe",
    subjects: "Math, Geometry",
    classes: "S4, A1, B1",
    phone: "1234567890",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T002",
    name: "Mike Oler",
    subjects: "Biology",
    classes: "S4, A1, B1",
    phone: "1234567891",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T003",
    name: "Jay French",
    subjects: "History",
    classes: "S4, A1, B1",
    phone: "1234567892",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T004",
    name: "Anna Santiago",
    subjects: "Physics, Spanish",
    classes: "S4, A1, B1",
    phone: "1234567893",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T005",
    name: "Ella Black",
    subjects: "English, Spanish",
    classes: "S4, A1, B1",
    phone: "1234567894",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T006",
    name: "Cophia Castro",
    subjects: "Literature, English",
    classes: "S4, A1, B1",
    phone: "1234567895",
    address: "123 Main St, AnyTown, USA",
  },
  {
    id: "T007",
    name: "Derek Briggs",
    subjects: "Biology",
    classes: "S4, A1, B1",
    phone: "1234567896",
    address: "123 Main St, AnyTown, USA",
  },
];

const TeachersTable = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Teachers</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Teacher ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Subjects</th>
            <th className="border px-4 py-2">Classes</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {teachersData.map((teacher) => (
            <tr key={teacher.id}>
              <td className="border px-4 py-2">{teacher.id}</td>
              <td className="border px-4 py-2">{teacher.name}</td>
              <td className="border px-4 py-2">{teacher.subjects}</td>
              <td className="border px-4 py-2">{teacher.classes}</td>
              <td className="border px-4 py-2">{teacher.phone}</td>
              <td className="border px-4 py-2">{teacher.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeachersTable;
