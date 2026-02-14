import Toastify from "toastify-js";

const toast = (text: string, onClick?: () => void) => {
  return Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "oklch(72.3% 0.219 149.579)",
      position: "fixed",
      bottom: "20px",
      right: "20px",
      minWidth: "300px",
      height: "60px",
      padding: "10px",
      borderRadius: "8px",
      color: "#e9e9e9",
      display: "flex",
      alignItems: "center",
      justifyContent:"center",
      fontWeight: "bold",
    },
    // node: (
    //   <>
    //     <CiDesktop />
    //     <h1>{text}</h1>
    //   </>
    // ),
    onClick, // Callback after click
  }).showToast();
};

export default toast;
