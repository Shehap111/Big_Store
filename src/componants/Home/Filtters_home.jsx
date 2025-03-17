import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { loadSubcategories } from "../../redux/slices/supCategorys_slice";

const Filters = ({ filters, dispatch, setFilter, setSortBy, colors = [] }) => {
  const reduxDispatch = useDispatch();

  // ✅ جلب الساب كاتيجوريز من Redux
  const { items: subcategories, loading } = useSelector((state) => state.subcategories);

  const [selectedSort, setSelectedSort] = useState({ value: "rating", label: "Top Rated" });

  // ✅ تحميل الساب كاتيجوريز عند تحميل الصفحة
  useEffect(() => {
    if (subcategories.length === 0) {
      reduxDispatch(loadSubcategories()); // ✅ تحميل الساب كاتيجوريز لو مش موجودة
    }
  }, [reduxDispatch, subcategories.length]);


  // ✅ تحديث الفلاتر عند تغيير الساب كاتيجوري
const handleSubcategoryChange = (selectedOptions) => {
  const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];

  dispatch(setFilter({ subCategory: selectedValues })); // ✅ تحديث الفلاتر مباشرة

};


  // ✅ تحديث الفرز عند اختيار نوع الترتيب
  const handleSortChange = (selectedOption) => {
    setSelectedSort(selectedOption);
    dispatch(setSortBy(selectedOption.value));
  };

  return (
    <div className="Slectes">

      {/* ✅ اختيار الساب كاتيجوري (متعدد) */}
<Select
  options={subcategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }))}
  isMulti
  placeholder="اختر الأقسام الفرعية..."
value={
  filters.subCategory?.map((subId) => {
    const subcategory = subcategories.find((s) => s.id === subId);
    return subcategory ? { value: subcategory.id, label: subcategory.name } : null;
  }).filter(Boolean) || []
}
  onChange={handleSubcategoryChange}
  isLoading={loading} 
/>

      {/* ✅ اختيار الترتيب */}
      <Select
        className="SortChange"
        options={[
          { value: "rating", label: "Top Rated" },
          { value: "latest", label: "Latest" },
          { value: "bestSelling", label: "Best Selling" },
          { value: "priceLowToHigh", label: "Price: Low to High" },
          { value: "priceHighToLow", label: "Price: High to Low" },
        ]}
        value={selectedSort}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default Filters;