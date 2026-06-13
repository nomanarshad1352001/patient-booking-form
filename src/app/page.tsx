import { db } from "@/db";
import { clinics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookingForm } from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Get the first active clinic
  const [clinic] = await db
    .select()
    .from(clinics)
    .where(eq(clinics.active, true))
    .limit(1);

  if (!clinic) {
    return (
      <main className="grid min-h-screen place-items-center px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">No clinic configured</h1>
          <p className="mt-2 text-slate-500">Please run the seed script to set up the database.</p>
        </div>
      </main>
    );
  }

  const clinicData = {
    id: clinic.id,
    name: clinic.name,
    slug: clinic.slug,
    address: clinic.address,
    phone: clinic.phone,
    email: clinic.email,
    themeColor: clinic.themeColor,
  };

  return <BookingForm clinic={clinicData} />;
}
