import UserCardCoponent from "@/components/user-card-component";
import CountChart from "@/components/count-chart";
import AttendanceChart from "@/components/attendance-chart";
import FinanceChart from "@/components/finance-chart";
import CalendarCompeonet from "@/components/calendar-componenet";
import AnnouncementsComponent from "@/components/announcements-componenet";

const AdminPage = () => {
  return <Dashboard />;
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* User Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["On Process", "Done", "Canceled", "Pending"].map((type, index) => (
                <UserCardCoponent key={index} type={type} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4">
                <CountChart />
              </div>
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
                <AttendanceChart />
              </div>
            </div>
            {/* Finance Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <FinanceChart />
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <CalendarCompeonet />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <AnnouncementsComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
