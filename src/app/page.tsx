import { CardExperience } from "@/components/card-experience";
import { profile } from "@/data/profile";

export default function Home() {
  return <CardExperience profile={profile} />;
}
