import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Acceso al panel | Hotel El Tormo",
  robots: { index: false, follow: false }
};

export default function AdminLoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-brand-100/50 px-5 py-20">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-brand-800/5">
            <h1 className="font-display text-2xl font-semibold tracking-tightest text-brand-800">
              Acceso al panel
            </h1>
            <p className="mt-2 text-sm text-brand-600">
              Introduce la contraseña del hotel para gestionar reservas y habitaciones.
            </p>
            <Suspense fallback={<p className="mt-6 text-sm text-brand-500">Cargando…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
