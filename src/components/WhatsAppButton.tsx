"use client";

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_HOTEL_WHATSAPP ?? "";
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hola, me gustaría consultar disponibilidad en Hotel El Tormo."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pl-4 pr-4 text-white shadow-lift ring-1 ring-black/5 transition-all duration-300 hover:gap-2 hover:pr-5"
    >
      <span className="flex h-14 w-9 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.09.55 4.13 1.6 5.93L0 24l6.38-1.67a11.8 11.8 0 0 0 5.67 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.14-3.39-8.44ZM12.06 21.5h-.01a9.6 9.6 0 0 1-4.9-1.34l-.35-.21-3.79.99 1.01-3.69-.23-.38a9.6 9.6 0 0 1-1.47-5.12c0-5.32 4.33-9.65 9.66-9.65 2.58 0 5 1 6.82 2.83a9.58 9.58 0 0 1 2.83 6.83c0 5.33-4.34 9.66-9.66 9.66Zm5.3-7.23c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
        </svg>
      </span>
      <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[7rem] group-hover:opacity-100">
        Escríbenos
      </span>
    </a>
  );
}
