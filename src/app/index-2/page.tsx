import type { Metadata } from "next";
import IndexTwoExperience from "./index-two-experience";

export const metadata: Metadata = {
  title: "ScaleShift | Cinematic Homepage Demo",
  description:
    "A cinematic alternative ScaleShift homepage demo for high-performing short-form video editing.",
};

export default function IndexTwoPage() {
  return <IndexTwoExperience />;
}
