import { Product } from "@stripe/firestore-stripe-payments";
import { CheckIcon } from "@heroicons/react/outline";
import { FaTimes } from "react-icons/fa";
import { TableRow } from "./TableRow";

interface Props {
  products: Product[];
  selectedPlan: Product | null;
}
export const Table = ({ products, selectedPlan }: Props) => {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <TableRow
          title="Monthly price"
          products={products}
          selectedPlan={selectedPlan}
          type="monthly"
        />
        <TableRow
          title="Video Quality"
          products={products}
          selectedPlan={selectedPlan}
          type="quality"
        />
        <TableRow
          title="Resolution"
          products={products}
          selectedPlan={selectedPlan}
          type="resolution"
        />
        <TableRow
          title="Watch on your TV, computer, mobile phone and tablet"
          products={products}
          selectedPlan={selectedPlan}
          type="portability"
        />
      </tbody>
    </table>
  );
};
