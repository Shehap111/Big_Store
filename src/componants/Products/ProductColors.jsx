import React from 'react';

const ProductColors = ({ colors, onColorClick, selectedColor }) => {
  return (
    <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
      {colors.map((color, index) => (
        <li
          key={index}
          onClick={() => onColorClick(color)} // هنا بنخلي الدائرة قابلة للضغط
          style={{
            backgroundColor: color,
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            margin: "5px",
            border: "0px solid transparent ",
            cursor: "pointer",
            // تغيير الشكل للون المختار
            border: color === selectedColor ? "3px solid #0e77df" : "2px solid transparent", // تحديد حدود اللون المختار
            transform: color === selectedColor ? "scale(1.2)" : "scale(1)" // تكبير الدائرة إذا تم اختيارها
          }}
        ></li>
      ))}
    </ul>
  );
};

export default ProductColors;
