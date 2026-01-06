import  { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  BarChart2,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getOverviewApi } from "../services/allApi";

/* ================= TYPES ================= */
interface OverviewCards {
  totalOrders: number;
  revenue: number;
  productsSold: number;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface Insights {
  topSellingProduct: {
    title: string;
    units: number;
  } | null;
  bestRevenueMonth: {
    month: string;
    revenue: number;
  } | null;
}

/* ================= COMPONENT ================= */
const Overview = () => {
  const [cards, setCards] = useState<OverviewCards | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    const res = await getOverviewApi();
    if (res.success) {
      setCards({
        totalOrders: res.data.overviewCards.totalOrders,
        revenue: res.data.overviewCards.revenue,
        productsSold: res.data.overviewCards.productsSold,
      });
      setSalesData(res.data.salesData);
      setInsights(res.data.insights);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const overviewData = cards
    ? [
        {
          title: "Total Orders",
          value: cards.totalOrders,
          icon: <ShoppingBag className="w-6 h-6 text-white" />,
          color: "bg-emerald-500",
        },
        {
          title: "Revenue",
          value: `₹${cards.revenue.toLocaleString()}`,
          icon: <DollarSign className="w-6 h-6 text-white" />,
          color: "bg-blue-500",
        },
        {
          title: "Products Sold",
          value: cards.productsSold,
          icon: <BarChart2 className="w-6 h-6 text-white" />,
          color: "bg-yellow-500",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      {loading && !cards ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewData.map((card, i) => (
            <div
              key={i}
              className={`flex items-center p-4 rounded-xl shadow-lg ${card.color} text-white`}
            >
              <div className="p-3 bg-white/20 rounded-full mr-4">
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{card.title}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-bold text-lg mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-bold text-lg mb-4">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Bar
                dataKey="orders"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold text-md mb-2">Top Selling Product</h3>
          <p className="text-sm text-slate-500">
            {insights?.topSellingProduct?.title || "—"}
          </p>
          <p className="text-xl font-bold mt-2">
            {insights?.topSellingProduct
              ? `${insights.topSellingProduct.units} units sold`
              : "—"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold text-md mb-2">Best Revenue Month</h3>
          <p className="text-sm text-slate-500">
            {insights?.bestRevenueMonth?.month || "—"}
          </p>
          <p className="text-xl font-bold mt-2">
            {insights?.bestRevenueMonth
              ? `₹${insights.bestRevenueMonth.revenue.toLocaleString()}`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
