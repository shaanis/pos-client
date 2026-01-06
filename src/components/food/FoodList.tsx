import type { Food } from "../food/types";

interface Props {
  foods: Food[];
  onEdit: (food: Food) => void;
  onDelete: (id: string) => void;
}

const FoodList = ({ foods, onEdit, onDelete }: Props) => {
  if (!foods.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-lg font-semibold">No food items found</h3>
        <p className="text-sm mt-1">
          Start by adding new food items to your menu
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {foods.map((food) => (
        <div
          key={food._id}
          className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
        >
          {/* Image */}
          <img
            src={food.image?.url || "/placeholder-food.png"}
            alt={food.title}
            className="h-40 w-full object-cover"
          />

          <div className="p-4 space-y-2">
            {/* Title */}
            <h3 className="font-semibold truncate">{food.title}</h3>

            {/* Price */}
            <p className="text-sm text-gray-600 font-medium">
              ₹{food.price}
            </p>

            {/* Offer badge */}
            {food.offer && (
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                {food.offer.label}
              </span>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => onEdit(food)}
                className="flex-1 text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(food._id)}
                className="flex-1 text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
