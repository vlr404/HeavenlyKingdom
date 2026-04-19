import React, { useState } from "react";
import "./ProductCard.css";
import { useCartStore } from "../../entity/cart/cartStore";

interface Product {
  id: number;
  name: string;
  price: number;
  cat: string;
  img: string;
  isNew: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, cat, img, isNew } = product;

  const { addItem } = useCartStore();

  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc-card">
      <div className="pc-image-wrap">
        {isNew && <span className="pc-badge">New</span>}
        <img src={img} alt={name} className="pc-image" />
        <button
          className={`pc-like ${liked ? "pc-like--active" : ""}`}
          onClick={() => setLiked(!liked)}
          aria-label="В избранное"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21C12 21 3 14.5 3 8.5C3 6 5 4 7.5 4C9.24 4 10.91 5.01 12 6.09C13.09 5.01 14.76 4 16.5 4C19 4 21 6 21 8.5C21 14.5 12 21 12 21Z"
              stroke="currentColor"
              strokeWidth="1.8"
              fill={liked ? "currentColor" : "none"}
            />
          </svg>
        </button>
      </div>

      <div className="pc-body">
        <span className="pc-cat">{cat}</span>
        <p className="pc-name">{name}</p>
        <div className="pc-footer">
          <span className="pc-price">
            {price.toLocaleString("ro-MD")}&thinsp;MDL
          </span>
          <button
            className={`pc-add ${added ? "pc-add--done" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;