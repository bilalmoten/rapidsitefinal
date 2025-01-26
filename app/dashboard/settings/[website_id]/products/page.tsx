import { ShoppingBag } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b00] backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-primary-main bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-primary-main" />
        </div>
        <h2 className="text-[28px] font-medium text-white mb-2">
          E-commerce Coming Soon
        </h2>
        <p className="text-neutral-40 text-sm max-w-md">
          Get ready to transform your website into a powerful online store.
          We're building robust e-commerce features to help you sell products
          and manage your inventory.
        </p>
      </div>
    </div>
  );
}
