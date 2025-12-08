import { FaWhatsapp } from "react-icons/fa";

const Whatsapp = ({ whatsapp }: { whatsapp: string }) => {
  if (!whatsapp) return null; 
  console.log(whatsapp)
  return (
    <a
      href={`https://wa.me`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:right-[50px] z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default Whatsapp;
