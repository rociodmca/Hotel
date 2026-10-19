import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckInForm } from "@/components/CheckInForm";

export const metadata = {
  title: "Check-in online | Hotel El Tormo",
  description: "Completa tus datos antes de la llegada para agilizar el registro en recepción."
};

const steps = [
  "Localiza tu referencia de reserva en el email de confirmación.",
  "Rellena los datos del documento del titular y sus acompañantes.",
  "Guarda el resguardo: solo tendrás que mostrar el documento al llegar."
];

export default function CheckInPage({ searchParams }: { searchParams: { booking?: string } }) {
  return (
    <>
      <Header />
      <main className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <h1 className="font-display text-4xl font-semibold tracking-tightest text-brand-800 sm:text-5xl">
              Llega sin esperas
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-600">
              Adelanta el registro y cumple con la normativa de hospederías (SES.HOSPEDAJES) desde
              casa. Al llegar, solo tendrás que recoger la llave.
            </p>

            <ol className="mt-8 space-y-5">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-semibold text-paper">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-brand-600">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-brand-700">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                </svg>
                Tus datos se tratan de forma confidencial y se comunican a las autoridades
                únicamente conforme a la normativa de registro de viajeros.
              </p>
            </div>
          </div>

          <CheckInForm bookingId={searchParams.booking ?? ""} />
        </div>
      </main>
      <Footer />
    </>
  );
}
