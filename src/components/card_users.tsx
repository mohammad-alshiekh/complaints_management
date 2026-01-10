import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({
  label,
  value,
  icon: Icon,
  iconBg = "from-indigo-500/20 to-indigo-500/5",
  iconColor = "text-indigo-600",
}) => {
  return (
    <Card className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="relative p-5">
        <div className="flex items-center justify-between">

          {/* Text */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500 mb-1">
              {label}
            </p>

            <h3 className="text-xl font-extrabold text-slate-700 leading-tight">
              {value}
            </h3>
          </div>

          {/* Icon */}
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center ${iconColor} shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-7 h-7" />
            </div>

            {/* Icon shine */}
            <div className="absolute inset-0 rounded-2xl bg-white/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
