import AnnouncementsComponent from "@/components/announcements-componenet";
import ComplianceCalender from "@/components/big-calandar";
 import ContaierTitle from "@/components/TitleContainer";

const StudentPage = () => {
  return (
    <div className="flex flex-1  p-4 gap-4 flex-col xl:flex-row h-fit">
      {/* Left */}
      <div className="w-full xl:w-2/3 flex flex-col gap-3 m-2 rounded-xl bg-white p-5">
        <ContaierTitle title="Attendaces" />

        <ComplianceCalender />
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
         <AnnouncementsComponent />
      </div>
    </div>
  );
};

export default StudentPage;
