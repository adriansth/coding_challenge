import { Sentiment } from "@/types/note";

const sentimentOptions = [
   {
      value: null,
      label: "All",
      emoji: "📝",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-200",
      selectedBg: "bg-gray-600",
      selectedText: "text-white",
   },
   {
      value: Sentiment.HAPPY,
      label: "Happy",
      emoji: "😊",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-200",
      selectedBg: "bg-green-600",
      selectedText: "text-white",
   },
   {
      value: Sentiment.SAD,
      label: "Sad",
      emoji: "😢",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-200",
      selectedBg: "bg-blue-600",
      selectedText: "text-white",
   },
   {
      value: Sentiment.NEUTRAL,
      label: "Neutral",
      emoji: "😐",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-200",
      selectedBg: "bg-gray-600",
      selectedText: "text-white",
   },
   {
      value: Sentiment.ANGRY,
      label: "Angry",
      emoji: "😠",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      hoverColor: "hover:bg-red-200",
      selectedBg: "bg-red-600",
      selectedText: "text-white",
   },
];

export default sentimentOptions;
