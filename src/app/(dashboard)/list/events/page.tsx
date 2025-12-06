// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { StatusPieChart } from '@/components/StatusPieChart'; // Ensure this client component exists

// interface Complaint {
//   id: string;
//   title: string;
//   status: 'new' | 'in-progress' | 'completed' | 'rejected';
//   createdAt: string;
// }

// interface StatusDistribution {
//   name: string;
//   value: number;
// }

// interface User {
//   id: string;
//   role: 'employee' | 'admin' | 'other';
//   agency_id: string;
// }

// const computeStats = (complaints: Complaint[]) => {
//   const total = complaints.length;
//   const newCount = complaints.filter((c) => c.status === 'new').length;
//   const inProgressCount = complaints.filter((c) => c.status === 'in-progress').length;
//   const completedCount = complaints.filter((c) => c.status === 'completed').length;
//   const rejectedCount = complaints.filter((c) => c.status === 'rejected').length;
//   return { total, new: newCount, inProgress: inProgressCount, completed: completedCount, rejected: rejectedCount };
// };

// const getStatusClasses = (status: string) => {
//   switch (status) {
//     case 'new':
//       return 'bg-gray-100 text-gray-800';
//     case 'in-progress':
//       return 'bg-blue-100 text-blue-800';
//     case 'completed':
//       return 'bg-green-100 text-green-800';
//     case 'rejected':
//       return 'bg-red-100 text-red-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

// export default async function EventsPage() {
//   const cookieStore = cookies();
//   const token = cookieStore.get('token')?.value;
//   const userStr = cookieStore.get('user')?.value;

//   if (!token || !userStr) {
//     redirect('/login');
//   }

//   let parsedUser: User;
//   try {
//     parsedUser = JSON.parse(userStr) as User;
//     if (parsedUser.role !== 'employee') {
//       redirect('/unauthorized');
//     }
//   } catch (error) {
//     console.error('Error parsing user data:', error);
//     redirect('/login');
//   }

//   let complaints: Complaint[] = [];
//   let statusDist: StatusDistribution[] = [];

//   try {
//     const headers = new Headers({ Authorization: `Bearer ${token}` });
//     const [complaintsRes, statusRes] = await Promise.all([
//       fetch(`/api/complaints?agency_id=${parsedUser.agency_id}`, { headers, cache: 'no-store' }),
//       fetch('/api/reports/status-distribution', { headers, cache: 'no-store' }),
//     ]);

//     if (complaintsRes.ok) {
//       complaints = await complaintsRes.json();
//     }
//     if (statusRes.ok) {
//       statusDist = await statusRes.json();
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }

//   const stats = computeStats(complaints);

//   const recentComplaints = complaints.slice(0, 5).map((complaint) => (
//     <div key={complaint.id} className="flex justify-between items-center p-4 border-b last:border-b-0 border-gray-200">
//       <div className="flex-1">
//         <h3 className="font-medium truncate">{complaint.title}</h3>
//         <p className="text-sm text-gray-500">
//           {new Date(complaint.createdAt).toLocaleDateString()}
//         </p>
//       </div>
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(complaint.status)}`}>
//         {complaint.status.replace('-', ' ')}
//       </span>
//     </div>
//   ));

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Events Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
//           <p className="text-sm font-medium text-gray-500 mb-2">Total Events</p>
//           <p className="text-3xl font-bold">{stats.total}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
//           <p className="text-sm font-medium text-gray-500 mb-2">New</p>
//           <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
//           <p className="text-sm font-medium text-gray-500 mb-2">In Progress</p>
//           <p className="text-3xl font-bold text-green-600">{stats.inProgress}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
//           <p className="text-sm font-medium text-gray-500 mb-2">Completed</p>
//           <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
//           <p className="text-sm font-medium text-gray-500 mb-2">Rejected</p>
//           <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold">Status Distribution</h3>
//           </div>
//           <div className="p-6 h-[400px]">
//             <StatusPieChart data={statusDist} />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold">Recent Events</h3>
//           </div>
//           <div className="p-0">
//             {complaints.length === 0 ? (
//               <div className="p-8 flex items-center justify-center text-gray-500">
//                 No recent events
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-200">{recentComplaints}</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
 