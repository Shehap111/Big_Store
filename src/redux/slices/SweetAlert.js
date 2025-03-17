// SweetAlert.js
import Swal from "sweetalert2";

// Handle alert in cart  
const handelAlert = (icon, title, background, iconColor) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        background: background,
        iconColor: iconColor,
        timerProgressBar: true,
        width: 'auto',
        color: "#000",
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: icon,
        title: title
    });
};

export default handelAlert;