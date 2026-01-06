import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import type { Food } from "../components/food/types";
import { getAllFoodsApi } from "../services/allApi";
import { Loader2 } from "lucide-react";

type Props = {
  sidebarExpanded: boolean;
};

const FoodGrid = ({ sidebarExpanded }: Props) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH FOODS ================= */
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await getAllFoodsApi();
      setFoods(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400 gap-2">
        <Loader2 className="animate-spin w-6 h-6" />
        <span>Loading meals...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      <p className="text-sm text-gray-500">
        {foods.length} meals found
      </p>

      {foods.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🍽️</div>
          <p>No meals available</p>
        </div>
      ) : (
        <div
          className={`grid gap-6 w-full 
          ${
            sidebarExpanded
              ? "grid-cols-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2"
              : "grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2"
          }`}
        >
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              title={food.title}
              price={`₹${food.price}`}
              image={food.image?.url}
              offer={food.offer} rating={0}            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
