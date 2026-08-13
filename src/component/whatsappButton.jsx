import React from 'react'

function whatsappButton() {
    
const whatsappInquiry = () => {
  const phoneNumber = "917230910907"; // Apna WhatsApp number country code ke saath
  const message = "Hello, mujhe aapke product ke baare mein inquiry karni hai.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
};

  return (
<>
<button
  onClick={whatsappInquiry}
  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
>
  <span>💬</span>
  WhatsApp Inquiry
</button>
    </>
    
  )
}

export default whatsappButton
