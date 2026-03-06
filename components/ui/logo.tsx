import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/LQ.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="LoadIQ">
      <Image src={logo} alt="LoadIQ Logo" width={36} height={36} />
    </Link>
  );
}
