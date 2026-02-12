import { FaFileImage } from "react-icons/fa";

interface NoImageProps {
  className?: string; // untuk custom width/height via Tailwind
  text?: string; // default tulisan "No Image"
  iconStyle?: string;
}

export default function NoImage({
  className = "w-24 h-16",
  text = "No Image",
  iconStyle,
}: NoImageProps) {
  return (
    <div
      className={`${className} flex items-center justify-center gap-4 bg-gray-200 text-gray-500 border border-gray-300 rounded`}
    >
      <FaFileImage className={`${iconStyle} w-8 h-8`} />
      {text}
    </div>
  );
}
