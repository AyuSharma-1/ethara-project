const CARD_STYLES = {
  "Total Tasks":  { bg: "bg-indigo-50", num: "text-indigo-700", dot: "bg-indigo-500" },
  "To Do":        { bg: "bg-zinc-50",   num: "text-zinc-700",   dot: "bg-zinc-400" },
  "In Progress":  { bg: "bg-amber-50",  num: "text-amber-700",  dot: "bg-amber-500" },
  "Overdue":      { bg: "bg-red-50",    num: "text-red-600",    dot: "bg-red-500" },
};

const StatCard = ({ label, value, highlight = false }) => {
  const style = CARD_STYLES[label] || CARD_STYLES["To Do"];

  return (
    <div className={`${style.bg} px-6 py-5`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
      </div>
      <p className={`text-4xl font-bold tracking-tight ${highlight ? "text-red-600" : style.num}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
