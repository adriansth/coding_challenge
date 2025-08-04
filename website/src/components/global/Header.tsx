import Link from "next/link";

export default function Header() {
   return (
      <div className="w-full lg:w-[1000px] flex flex-col gap-y-5 items-start px-5 sm:px-10 lg:px-20">
         <h1 className="text-neutral-800 text-4xl font-medium">
            Sentiment Notes
         </h1>
         <p className="text-neutral-700 font-medium">
            Welcome to Sentiment Notes. This is a Coding Challenge provided by{" "}
            <Link
               href="https://mipey.mx"
               target="_blank"
               className="text-blue-600 hover:underline cursor-pointer"
            >
               pey
            </Link>{" "}
            and made by{" "}
            <Link
               href="https://github.com/adriansth"
               target="_blank"
               className="text-blue-600 hover:underline cursor-pointer"
            >
               @adriansth
            </Link>
            .
         </p>
      </div>
   );
}
