import { useEffect, useState } from "react";
import type { Food } from "../food/types";
import { Loader2 } from "lucide-react";

interface Props {
  selectedFood?: Food | null;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onCancel?: () => void;
}

/* ================= OFFERS ================= */
const OFFERS = [
  { type: "PERCENT", label: "10% Off", value: 10 },
  { type: "PERCENT", label: "20% Off", value: 20 },
  { type: "BOGO", label: "Buy 1 Get 1" },
  { type: "BOGO", label: "Buy 2 Get 2" },
] as const;

const FoodForm = ({ selectedFood, onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [offer, setOffer] = useState<typeof OFFERS[number] | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (selectedFood) {
      setTitle(selectedFood.title);
      setPrice(selectedFood.price);

      if (selectedFood.offer) {
        const matched = OFFERS.find(
          (o) =>
            o.type === selectedFood.offer?.type &&
            o.label === selectedFood.offer?.label
        );
        setOffer(matched || null);
      } else {
        setOffer(null);
      }

      setPreview(selectedFood.image?.url || "");
      setImage(null);
    } else {
      setTitle("");
      setPrice(0);
      setOffer(null);
      setImage(null);
      setPreview("");
    }
  }, [selectedFood]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (file: File | null) => {
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", String(price));

      if (offer) {
        formData.append(
          "offer",
          JSON.stringify({
            type: offer.type,
            label: offer.label,
            value: offer.type === "PERCENT" ? offer.value : undefined,
          })
        );
      }

      if (image) formData.append("image", image);

      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800">
        {selectedFood ? "Edit Food Item" : "Add New Food"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TITLE */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Food Title</label>
          <input
            type="text"
            value={title}
            disabled={loading}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
            required
          />
        </div>

        {/* PRICE */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            value={price}
            disabled={loading}
            min={0}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
            required
          />
        </div>

        {/* OFFER */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Offer</label>
          <select
            value={offer?.label || ""}
            disabled={loading}
            onChange={(e) => {
              const selected = OFFERS.find(
                (o) => o.label === e.target.value
              );
              setOffer(selected || null);
            }}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
          >
            <option value="">No Offer</option>
            {OFFERS.map((o) => (
              <option key={o.label} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Food Image</label>
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) =>
              handleImageChange(e.target.files?.[0] || null)
            }
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-48 w-full object-cover rounded-lg shadow"
            />
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 justify-end mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {selectedFood ? "Update Food" : "Add Food"}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
