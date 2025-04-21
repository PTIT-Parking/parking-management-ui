import Image from "next/image";

interface LocalIconProps {
  name: string;
  className?: string;
  size?: number;
  alt?: string;
}

export function LocalIcon({ 
  name, 
  className = "", 
  size = 24,
  alt = "icon" 
}: Readonly<LocalIconProps>) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      className={className}
    />
  );
}