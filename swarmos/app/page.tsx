export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to SwarmOS
        </h1>
        <div className="text-center mb-12">
          <p className="text-lg mb-4">
            Enterprise AI SDR + Voice + Ads + Swarm + Dashboard system
          </p>
        </div>

        <div className="grid text-center lg:grid-cols-3 lg:text-left gap-4">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              🗄️ Supabase
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Database & Authentication ready
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              🤖 OpenAI
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              AI & Language Models integrated
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              💳 Stripe
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Payment processing configured
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              📧 Resend
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Email service ready to use
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              📱 Twilio
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              SMS & Voice communications
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              🚀 Next.js 14
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              App Router with TypeScript
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm opacity-70">
            Edit <code className="font-mono font-bold">app/page.tsx</code> to get started
          </p>
        </div>
      </div>
    </main>
  )
}
