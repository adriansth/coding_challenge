"use client";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";

export default function AmplifyTest() {
   const [config, setConfig] = useState<any>(null);

   useEffect(() => {
      try {
         // get current Amplify configuration
         const currentConfig = Amplify.getConfig();
         setConfig(currentConfig);
         console.log("Current Amplify Config:", currentConfig);
      } catch (err) {
         console.error("Failed to get Amplify config", err);
      }
   }, []);

   return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-md">
         <div className="font-bold mb-2">🔧 Amplify Status</div>
         {config ? (
            <div>
               <div className="text-green-400">✅ Amplify Configured</div>
               <div className="mt-1">
                  Region: {config.API?.GraphQL?.region || "Not set"}
               </div>
               <div>
                  Endpoint:{" "}
                  {config.API?.GraphQL?.endpoint ? "✅ Set" : "❌ Missing"}
               </div>
               <div>
                  Auth: {config.API?.GraphQL?.defaultAuthMode || "Not set"}
               </div>
            </div>
         ) : (
            <div className="text-red-400">❌ Amplify Not Configured</div>
         )}
      </div>
   );
}
