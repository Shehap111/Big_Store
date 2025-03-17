import { useState } from "react";
import { Range } from "react-range";

const PriceRangeSlider = ({ filters, dispatch, setFilter }) => {
  const isRTL = document.documentElement.dir === "rtl";
  const [values, setValues] = useState([
    filters.priceRange?.min || 0,
    filters.priceRange?.max || 2500,
  ]);

  const handleChange = (newValues) => {
    setValues(newValues);
    const updatedValues = isRTL
      ? { min: 2500 - newValues[1], max: 2500 - newValues[0] }
      : { min: newValues[0], max: newValues[1] };

    dispatch(setFilter({ priceRange: updatedValues }));
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Range
        step={10}
        min={0}
        max={2500}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props; // 🔥 استبعاد key قبل عمل spread
          return (
            <div
              key={key} // ✅ إضافة key بشكل صريح
              {...restProps}
              style={{
                ...restProps.style,
                height: "6px",
                width: "100%",
                background: "#ddd",
                position: "relative",
                direction: "ltr",
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => {
          const { key, ...restProps } = props; // 🔥 استبعاد key قبل عمل spread
          return (
            <div
              key={key} // ✅ إضافة key بشكل صريح
              {...restProps}
              style={{
                ...restProps.style,
                height: "20px",
                width: "20px",
                backgroundColor: "#3498db",
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
                transform: isRTL ? "translateX(50%)" : "none",
              }}
            />
          );
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <span>Min: {isRTL ? 2500 - values[1] : values[0]}$</span>
        <span>Max: {isRTL ? 2500 - values[0] : values[1]}$</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
