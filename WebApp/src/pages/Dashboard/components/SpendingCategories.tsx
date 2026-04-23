import CategoryDonut from "../../Expenses/components/CategoryDonut";
import { startOfMonth, endOfMonth } from "date-fns";

export default function SpendingCategories() {
  const start = startOfMonth(new Date()).toISOString().split("T")[0];
  const end = endOfMonth(new Date()).toISOString().split("T")[0];

  return (
    <CategoryDonut 
      startDate={start} 
      endDate={end} 
      title="Spending Breakdown" 
    />
  );
}
