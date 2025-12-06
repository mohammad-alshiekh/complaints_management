import Image from "next/image";

const UserCardCoponent = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "On Process":
        return "bg-blue-50 text-blue-600";
      case "Done":
        return "bg-green-50 text-green-600";
      case "Canceled":
        return "bg-red-50 text-red-600";
      case "Pending":
        return "bg-yellow-50 text-yellow-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "On Process":
        return "/student.png";
      case "Done":
        return "/teacher.png";
      case "Canceled":
        return "/parent.png";
      case "Pending":
        return "/parent.png";
      default:
        return "/parent.png";
    }
  };
//Total Complaints, New Complaints (Last h), Complaints In-Progress,Average Resolution Time.
  return (
    <div
      className={`rounded-xl ${getTypeColor(type)} p-4 transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs bg-white/50 px-2 py-1 rounded-full font-medium">
          2022/2/2
        </span>
        <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
          <Image
            alt="more options"
            src="/more.png"
            width={16}
            height={16}
            className="opacity-60"
          />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">1,214</h1>
          <h2 className="text-sm font-medium capitalize mt-1">{type}s</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
          <Image
            src={getTypeIcon(type)}
            alt={`${type} icon`}
            width={20}
            height={20}
            className="opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCardCoponent;
