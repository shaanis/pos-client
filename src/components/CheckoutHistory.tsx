import React, { useState, useEffect } from "react";
import { CreditCard, Loader2, ShoppingBag, IndianRupee, Search, ChevronRight, Calendar, Package, Filter } from "lucide-react";
import { getAllCheckoutsApi, type Checkout, type PaginatedResponse } from "../services/allApi";

const statusStyles: Record<string, { bg: string; text: string; icon: string }> = {
  Completed: { 
    bg: "bg-gradient-to-r from-emerald-500 to-teal-400", 
    text: "text-emerald-600",
    icon: "✓"
  },
  Pending: { 
    bg: "bg-gradient-to-r from-amber-500 to-orange-400", 
    text: "text-amber-600",
    icon: "⏳"
  },
  Cancelled: { 
    bg: "bg-gradient-to-r from-rose-500 to-pink-400", 
    text: "text-rose-600",
    icon: "✕"
  },
};

const CheckoutHistoryPage = () => {
  const [search, setSearch] = useState("");
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchCheckouts = async (pageNum: number) => {
    setLoading(true);
    try {
      const res: PaginatedResponse<Checkout> = await getAllCheckoutsApi(pageNum, 10);
      if (res.success) {
        setCheckouts(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts(page);
  }, [page]);

  const filtered = checkouts.filter(
    (o) =>
      (statusFilter === "All" || o.status === statusFilter) &&
      (o._id.toLowerCase().includes(search.toLowerCase()) ||
       o.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
       (o.status || "").toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue = checkouts.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = checkouts.length > 0 ? totalRevenue / checkouts.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 p-4 md:p-8 space-y-8">
      
      {/* ===== Header ===== */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span>Transactions</span>
            </div>
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Checkout History
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, payment, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
        
          </div>
        </div>

        
      </div>

      {/* ===== Loader ===== */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium">Loading transactions...</p>
        </div>
      )}

      {/* ===== Desktop Table ===== */}
      {!loading && filtered.length > 0 && (
        <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/50">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white/50">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <p className="text-sm text-gray-500">All checkout records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white/80 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Items</th>
                  <th className="px-6 py-4 text-left font-semibold">Total</th>
                  <th className="px-6 py-4 text-left font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {filtered.map((o) => (
                  <tr 
                    key={o._id} 
                    className="hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-white transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold text-gray-800">{o._id}</p>
                          <p className="text-xs text-gray-500">Transaction</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(o.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{o.items.length}</span>
                        </div>
                        <span className="text-sm text-gray-600">items</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        ₹{o.total.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 w-fit">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{o.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusStyles[o.status || "Pending"]?.bg}`}></div>
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${statusStyles[o.status || "Pending"]?.text} bg-gradient-to-r ${statusStyles[o.status || "Pending"]?.bg} bg-opacity-10`}>
                          <span className="mr-2">{statusStyles[o.status || "Pending"]?.icon}</span>
                          {o.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Mobile Cards ===== */}
      <div className="lg:hidden space-y-4">
        {filtered.map((o) => (
          <div
            key={o._id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 space-y-4 border border-gray-100/50"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <p className="font-mono text-sm font-semibold text-gray-800">{o._id}</p>
                </div>
                <p className="text-xs text-gray-500">Transaction ID</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[o.status || "Pending"]?.text} bg-gradient-to-r ${statusStyles[o.status || "Pending"]?.bg} bg-opacity-10`}>
                  {o.status}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Items</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">{o.items.length}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">items</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Payment</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{o.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                ₹{o.total}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Empty State ===== */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <CreditCard className="w-12 h-12 text-gray-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">No transactions found</h3>
            <p className="text-gray-500 max-w-md">
              {search || statusFilter !== "All" 
                ? "No transactions match your search criteria. Try different filters."
                : "No transactions available. Check back later."}
            </p>
          </div>
        </div>
      )}

      {/* ===== Pagination ===== */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/50">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{(page-1)*10 + 1}-{Math.min(page*10, checkouts.length)}</span> of <span className="font-semibold text-gray-700">{checkouts.length}</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                const pageNum = page <= 3 ? idx + 1 : 
                              page >= totalPages - 2 ? totalPages - 4 + idx :
                              page - 2 + idx;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${page === pageNum 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutHistoryPage;

