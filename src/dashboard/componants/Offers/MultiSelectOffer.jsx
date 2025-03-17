import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";


const MultiSelectOffer = ({ selectedProducts, setSelectedProducts }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  return (
<div className="multi-select-container">
  <input
    type="text"
    placeholder="Search product by name or ID"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />

  {searchTerm && (
    <div className="dropdown_Product">
      {products
        .filter((p) =>
          p.title?.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(p.id).includes(searchTerm) 
        )
        .slice(0, 5)
        .map((product) => (
          <div key={product.id} className="dropdown-item" onClick={() => handleSelectProduct(product)}>
            <img src={product.imageUrl} alt={product.title.en} className="dropdown-img" />
            <span>{product.title.en} - ${product.price}</span>
          </div>
        ))}
    </div>
  )}

  <div className="selected-products">
    {selectedProducts.map((product) => (
      <div key={product.id} className="selected-item">
        <img src={product.imageUrl} alt={product.title.en} className="selected-img" />
        <span>{product.title.en} - ${product.price}</span>
        <button className="remove-btn" onClick={() => handleRemoveProduct(product.id)}>X</button>
      </div>
    ))}
  </div>
      
</div>


  );
};

export default MultiSelectOffer;
