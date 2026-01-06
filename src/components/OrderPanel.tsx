import  { useEffect, useRef, useState } from "react";
import { 
  Plus, Minus, ShoppingBag, 
  CreditCard, ReceiptText, X, Loader2, Check 
} from "lucide-react";
import { getCart, saveCart } from "../utils/cartSession";
import { applyOffers } from "../utils/offerCalculator";
import { addCheckoutApi } from "../services/allApi";
import { generateReceiptPDF } from "../utils/generateReceipt";

type CartItem = {
  title: string;
  price: number;
  qty: number;
  image?: string;
  offer?: {
    label: string;
    type?: "BOGO" | "PERCENT";
    value?: number;
  };
};

type OrderItem = CartItem & { discountAmount: number };
type PaymentMethod = "CASH" | "CARD" | "ONLINE";

const Toast = ({ message, show }: { message: string; show: boolean }) => (
  <div
    className={`
      fixed top-6 right-6 z-[999] flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg
      transform transition-all duration-500
      ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"}
    `}
  >
    <Check className="animate-bounce w-5 h-5" />
    <span className="font-bold">{message}</span>
  </div>
);

const OrderPanel = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [isPaying, setIsPaying] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH"); 
  const [showToast, setShowToast] = useState(false);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const syncCart = () => {
    const cart = getCart();
    setItems(applyOffers(cart));
  };

  useEffect(() => {
    syncCart();
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = items.reduce((acc, item) => acc + (item.discountAmount || 0), 0);
  const total = Math.max(0, subtotal - discount);

  const updateQty = (index: number, delta: number) => {
    const cart = getCart();
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    syncCart(); // Update receipt immediately
  };

  const handlePrint = async () => {
    const element = receiptRef.current;
    if (!element || items.length === 0) return;

    setIsPrinting(true);
    console.log(isPrinting);
    
    const container = element.parentElement;
    const originalStyle = container?.style.cssText || "";

    try {
      if (container) {
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 380px;
          z-index: 9999;
          opacity: 1;
          visibility: visible;
          display: block;
          background: white;
        `;
      }

      // Wait for React to render receipt items
      await new Promise(r => setTimeout(r, 300));

      await generateReceiptPDF(element);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      if (container) container.style.cssText = originalStyle;
      setIsPrinting(false);
    }
  };

  const handlePayment = async () => {
    if (items.length === 0) return;
    setIsPaying(true);

    const apiItems: CartItem[] = items.map(item => ({
      title: item.title,
      price: item.price,
      qty: item.qty,
      image: item.image,
      offer: item.offer
        ? {
            label: item.offer.label,
            type: item.offer.type === "BOGO" || item.offer.type === "PERCENT" ? item.offer.type : undefined,
            value: item.offer.value,
          }
        : undefined,
    }));

    const payload = { items: apiItems, subtotal, discount, total, paymentMethod };

    try {
      const res = await addCheckoutApi(payload);

      if (res.success !== false) {
        await handlePrint(); // wait for PDF generation
        sessionStorage.removeItem("pos_cart");
        window.dispatchEvent(new Event("cart-updated"));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <Toast message="Payment Successful!" show={showToast} />

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-[70] bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-emerald-600">
              {items.length}
            </span>
          </div>
        </button>
      )}

      <div 
        className={`lg:hidden fixed inset-0 bg-slate-900/60 z-[55] transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed right-0 top-0 h-screen bg-white flex flex-col z-[60]
          transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          w-full sm:w-[420px] shadow-2xl
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="shrink-0 p-6 bg-white border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 className="font-black text-slate-800 tracking-tight">Current Order</h2>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-4 bg-slate-50/30">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <ReceiptText size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-bold text-sm uppercase tracking-widest opacity-40 text-center px-10">
                Cart is empty.<br/>Add items to start order.
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-emerald-100 transition-all ">
                <div className="flex gap-4">
                  <img
                    src={item.image || "/food-placeholder.png"}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    onError={(e) => {(e.target as HTMLImageElement).src = "/food-placeholder.png";}}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{item.title}</h3>
                        <button onClick={() => updateQty(i, -item.qty)} className="text-slate-300 hover:text-rose-500"><X size={14} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-emerald-600 font-black text-sm">₹{(item.price * item.qty - (item.discountAmount || 0)).toFixed(2)}</span>
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-3">
                        <button onClick={() => updateQty(i, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-90 transition-all"><Minus size={12} strokeWidth={3} /></button>
                        <span className="text-xs font-black text-slate-800">{item.qty}</span>
                        <button onClick={() => updateQty(i, 1)} className="w-7 h-7 flex items-center justify-center bg-emerald-500 text-white rounded-lg shadow-sm active:scale-90 transition-all"><Plus size={12} strokeWidth={3} /></button>
                      </div>
                    </div>
                    {item.discountAmount > 0 && <p className="text-[10px] text-rose-500 font-bold mt-1">Discount: ₹{item.discountAmount.toFixed(2)}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment */}
        <div className="shrink-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-700">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Discount</span>
              <span className="text-rose-500">-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-2">
              <span className="font-black text-slate-800 text-base uppercase tracking-tight">Total</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-3">
            {(["CASH", "CARD", "ONLINE"] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`
                  px-3 py-1 text-[10px] font-bold rounded-full border transition-colors
                  ${paymentMethod === method
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}
                `}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              disabled={items.length === 0 || isPaying}
              onClick={handlePayment}
              className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 text-white p-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPaying ? <Loader2 size={20} className="animate-spin" /> : <><CreditCard size={20} /> Checkout</>}
            </button>
          </div>
        </div>

        {/* Hidden Receipt for PDF */}
        <div style={{ position: "absolute", left: "-9999px", top: 0, visibility: "visible" }}>
          <div
            ref={receiptRef}
            className="bg-white text-black p-6 font-mono tracking-tight"
            style={{ width: "300px" }}
          >
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold uppercase">Shop Name</h1>
              <p className="text-[10px]">123 Main Street, New York</p>
              <p className="text-[10px]">{new Date().toLocaleString()}</p>
            </div>

            <div className="border-t border-black border-dashed my-2"></div>
            <p className="text-center text-[11px] font-bold">CASH RECEIPT</p>
            <div className="border-t border-black border-dashed my-2"></div>

            <div className="flex justify-between text-[11px] font-bold mb-2">
              <span>ITEM</span>
              <span>PRICE</span>
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="text-[11px]">
                  <div className="flex justify-between">
                    <span>{item.title} (x{item.qty})</span>
                    <span>₹{(item.price * item.qty - (item.discountAmount || 0)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black border-dashed my-4"></div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Total Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-black mt-2">
                <span>Payable Amount:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-[11px] font-bold">THANK YOU!</p>
              <div className="mt-2 flex justify-center">
                <div className="h-8 flex items-end gap-[1px] w-4/5 border-black">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="bg-black flex-1" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default OrderPanel;
