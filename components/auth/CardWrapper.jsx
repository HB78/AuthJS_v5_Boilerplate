"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AuthHearder from "./AuthHearder";
import BackButton from "./BackButton";
import Social from "./Social";

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}) => {
  return (
    <Card className="w-[90%] shadow-md bg-white lg:w-[400px] md:w-[600px]">
      <CardHeader>
        <AuthHearder label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {/* si showSocial fait partie des props on la montre */}
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
