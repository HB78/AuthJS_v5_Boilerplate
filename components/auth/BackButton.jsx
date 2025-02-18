import { Button } from "@/components/ui/button";
import Link from "next/link";

const BackButton = ({ label, href }) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
