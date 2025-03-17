import Swal from "sweetalert2";

const handelAlert = async ({ title, text, icon, confirmButtonText, cancelButtonText, confirmButtonColor = "#d33", cancelButtonColor = "#3085d6" }) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
  });
  return result;
};

export default handelAlert;
