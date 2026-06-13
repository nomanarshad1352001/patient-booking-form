import { BookingForm } from "@/components/BookingForm";
import { dummyClinic } from "@/lib/dummy-data";

export default function HomePage() {
  return <BookingForm clinic={dummyClinic} />;
}
