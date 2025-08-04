"use client";
import { useEffect } from "react";
import { configureAmplify } from "../../lib/aws-config";

export default function AmplifyProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   useEffect(() => {
      // configure Amplify on client mount
      configureAmplify();
   }, []);

   return <>{children}</>;
}
