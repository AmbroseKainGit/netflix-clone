import { Product } from "@stripe/firestore-stripe-payments";
import { CheckIcon } from "@heroicons/react/outline";
import { FaTimes } from "react-icons/fa";

interface Props {
  title: string;
  products: Product[];
  selectedPlan: Product | null;
  type: string;
}
export const TableRow = ({ title, products, selectedPlan, type }: Props) => {
  const children = (product: Product, type: string): string | JSX.Element => {
    switch (type) {
      case "monthly":
        return `EUR${product?.prices[0].unit_amount! / 100}`;
      case "quality":
        return `${product.metadata.videoQuality}`;
      case "resolution":
        return `${product.metadata.resolution}`;
      case "portability":
        return product.metadata.portability === "true" ? (
          <CheckIcon className="inline-block h-8 w-8" />
        ) : (
          <FaTimes className="inline-block h-8 w-8" />
        );
      default:
        return "";
    }
  };
  return (
    <tr className="table-row">
      <td className="table-data-title">{title}</td>
      {products.map((product) => (
        <td
          key={product.id}
          className={`table-data-feature ${
            selectedPlan?.id === product.id ? "text-[#e50914]" : "text-[gray]"
          }`}
        >
          {children(product, type)}
        </td>
      ))}
    </tr>
  );
};
