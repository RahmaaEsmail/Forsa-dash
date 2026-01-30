import { TrendingDown, TrendingUp } from "lucide-react";

export default function StatisticCard({ title, number, icon, bgIcon, rating, up, desc }) {
  return (
    <div className="bg-white rounded-main p-5 flex flex-col gap-[17px]">
      <div className="flex justify-between items-center">
        <p className="text-base font-medium text-secondary">{title}</p>

        <div
          className="w-10 h-10 flex justify-center items-center rounded-full p-2"
          style={{ backgroundColor: bgIcon }}   // ✅ هنا
        >
          <img src={icon} className="w-6 h-6" alt={title} />
        </div>
      </div>

      <h2 className="font-bold text-secondary text-x-large">{number}</h2>

      {rating && <div className={`flex gap-1 font-bold text-small items-center ${up ? "text-success" : "text-danger"}`}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <p>{rating}</p>
      </div>}
      {desc && <p className="font-bold text-[#313D4F] text-base">{desc}</p>}
    </div>
  );
}
