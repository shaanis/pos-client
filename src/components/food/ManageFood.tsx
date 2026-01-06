import { useEffect, useState } from "react";
import FoodForm from "./FoodForm";
import type { Food } from "./types";
import {
  getAllFoodsApi,
  addFoodApi,
  updateFoodApi,
  deleteFoodApi,
} from "../../services/allApi";
import { Loader2, Plus } from "lucide-react";

const ManageFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH ================= */
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await getAllFoodsApi();

      console.log("Foods API response:", res?.data);

      setFoods(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleAddOrUpdate = async (formData: FormData) => {
    try {
      setLoading(true);

      if (selectedFood) {
        await updateFoodApi(selectedFood._id, formData);
      } else {
        await addFoodApi(formData);
      }

      setSelectedFood(null);
      setShowModal(false);
      fetchFoods();
    } catch (error) {
      console.error("Error adding/updating food:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this food?")) return;

    try {
      setLoading(true);
      await deleteFoodApi(id);
      fetchFoods();
    } catch (error) {
      console.error("Error deleting food:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODAL ================= */
  const openModal = (food: Food | null = null) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFood(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Foods</h1>
        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" /> Add Food
        </button>
      </div>

      {/* ================= LIST ================= */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 gap-2">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Loading foods...</span>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
\          <h3 className="text-lg font-semibold">No food items found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              <img
                src={food.image?.url || "/placeholder-food.png"}
                alt={food.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{food.title}</h3>
                <p className="text-gray-500">₹{food.price}</p>

                
               

                {food.offer && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    {food.offer.label}
                  </span>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => openModal(food)}
                    className="flex-1 text-sm px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food._id)}
                    className="flex-1 text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            <FoodForm
              selectedFood={selectedFood}
              onSubmit={handleAddOrUpdate}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
