import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-light p-8 space-y-8">
      {/* Heading in Poppins */}
      <section className="text-center">
        <h1 className="font-heading text-5xl text-brand-800">
          Poppins Heading
        </h1>
        <h2 className="font-heading text-2xl text-accent-600 mt-2">
          Subheading with Poppins
        </h2>
      </section>

      {/* Body in Inter */}
      <section className="max-w-xl text-center">
        <p className="font-sans text-base text-brand-600">
          This paragraph uses Inter. Inter is clean, highly readable,
          and works well for body text in apps and dashboards.
        </p>
        <p className="font-sans text-sm text-neutral-text bg-brand-800 mt-4 p-3 rounded">
          Example of Inter on dark background.
        </p>
      </section>

      {/* Side-by-side comparison */}
      <section className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="p-4 border rounded">
          <h3 className="font-heading text-xl text-brand-700">
            Poppins (Heading)
          </h3>
          <p className="font-heading text-base text-brand-500">
            Sample text: The quick brown fox jumps over the lazy dog.
          </p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-sans text-xl text-brand-700">
            Inter (Body)
          </h3>
          <p className="font-sans text-base text-brand-500">
            Sample text: The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </section>
    </main>
  )
}
