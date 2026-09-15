import Image from "next/image";

export function BrandMark() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <Image
      className="brand-mark"
      src={`${basePath}/tron.svg`}
      width={32}
      height={32}
      alt=""
      priority
    />
  );
}
