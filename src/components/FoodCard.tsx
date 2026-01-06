import { Plus, Star } from "lucide-react";
import { addToCart } from "../utils/cartSession";
import { useState } from "react";

type Props = {
  title: string;
  price: string; // "₹250"
  rating: number;
  image?: string;
  offer?: {
    label: string;
  };
};

const FoodCard = ({ title, price, rating, image, offer }: Props) => {
  const [clicked, setClicked] = useState(false);

  const handleAdd = () => {
    setClicked(true);

    addToCart({
      title,
      image,
      // ✅ works for ₹ $ or plain numbers
      price: Number(price.replace(/[^\d.]/g, "")),
      qty: 1,
      ...(offer && {
        offer: {
          label: offer.label,
          type: offer.label.includes("%") ? "PERCENT" : "BOGO",
          value: offer.label.includes("%")
            ? parseInt(offer.label)
            : undefined,
        },
      }),
    });

    setTimeout(() => setClicked(false), 250);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 relative flex flex-col h-[230px]">
      {/* Offer Badge */}
      {offer && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          {offer.label}
        </span>
      )}

      {/* Image */}
      <div className="h-28 rounded-xl mb-3 bg-gray-100 overflow-hidden relative">
        <img
          src={image || "/food-placeholder.png"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-sm truncate leading-tight">
        {title}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
        <Star size={12} fill="currentColor" />
        <span>{rating.toFixed(1)}</span>
      </div>

      {/* Price + Button */}
      <div className="mt-auto flex items-center justify-between">
        <p className="font-bold text-sm">{price}</p>

        <button
          onClick={handleAdd}
          className={`relative w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center transition-transform duration-200 overflow-hidden active:scale-90 ${
            clicked ? "scale-105 shadow-md shadow-green-300" : ""
          }`}
        >
          <Plus size={18} />

          {/* Ripple */}
          {clicked && (
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-40 animate-ping pointer-events-none" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
