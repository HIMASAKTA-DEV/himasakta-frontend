interface NoImageProps {
  className?: string; // untuk custom width/height via Tailwind
  text?: string; // default tulisan "No Image"
}

export default function NoImage({
  className = "w-24 h-16",
  text = "No Image",
}: NoImageProps) {
  return (
    <div
      className={`${className} flex items-center justify-center bg-gray-200 text-gray-500 border border-gray-300 rounded`}
    >
      {text}
    </div>
  );
}
