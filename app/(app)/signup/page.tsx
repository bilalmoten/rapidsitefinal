import SignupForm from "./SignupForm";
import { Suspense } from "react";
import WaitlistForm from "@/components/WaitlistForm";
import AnimatedLoginContent from "@/components/AnimatedLoginContent";
import MotionWrapper from "@/components/MotionWrapper";
import AnonymousSignupForm from "./AnonymousSignupForm";

// Set this to false to enable normal signups
const WAITLIST_MODE = true;

export default async function SignupPage(props: {
  params: Promise<{}>;
  searchParams: Promise<{ message?: string; anonymous?: string }>;
}) {
  const searchParams = await props.searchParams;
  const isAnonymousConversion = searchParams.anonymous === "true";

  if (WAITLIST_MODE) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MotionWrapper className="flex h-screen">
          <div className="w-2/5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
            <AnimatedLoginContent />
            <div className="absolute bottom-0 left-0 right-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#ffffff"
                  fillOpacity="0.2"
                  d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
          <WaitlistForm />
        </MotionWrapper>
      </Suspense>
    );
  }

  return (
    <MotionWrapper className="flex h-screen">
      <div className="w-2/5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <AnimatedLoginContent />
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      <div className="w-3/5 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
          <Suspense fallback={<div>Loading...</div>}>
            {isAnonymousConversion ? (
              <AnonymousSignupForm message={searchParams.message} />
            ) : (
              <SignupForm message={searchParams.message} />
            )}
          </Suspense>
        </div>
      </div>
    </MotionWrapper>
  );
}
