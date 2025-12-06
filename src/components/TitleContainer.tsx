import Image from "next/image";  

const ContaierTitle = ({ title }: { title: string }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        <Image alt="logo" src="/moreDark.png" width={14} height={14} />
      </div>
    </div>
  );
};
export default ContaierTitle;
