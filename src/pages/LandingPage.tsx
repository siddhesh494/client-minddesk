import { Link } from "react-router-dom";

const steps = [
  {
    title: "Add business information",
    body: "Write products, policies, hours, and support details in a familiar editor.",
  },
  {
    title: "AI indexes the information",
    body: "We chunk the text, generate embeddings, and store them privately for that business.",
  },
  {
    title: "Get a business UUID",
    body: "Each knowledge base receives a stable public identifier you can share with a client.",
  },
  {
    title: "Connect WhatsApp or chat",
    body: "The client sends that UUID with every customer message to our chat API.",
  },
  {
    title: "Customers get grounded answers",
    body: "The assistant answers from that business knowledge base only — never another tenant.",
  },
];

export function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      <section className="grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-accent-700">Customer knowledge, quietly done</p>
          <h1 className="max-w-xl font-serif text-5xl leading-tight text-ink-900">
            MindDesk turns your business knowledge into an AI customer assistant.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-ink-700">
            Give each client a private knowledge base, a UUID, and a chat API they can connect to WhatsApp
            or any customer channel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/busninessList"
              className="rounded-full bg-accent-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-700"
            >
              Integrate Your Client
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm text-ink-800 hover:bg-ink-50"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-ink-200 bg-white p-6 shadow-card">
          <p className="text-sm text-ink-700">A typical client request</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink-50 p-4 text-xs leading-6 text-ink-800">
{`POST /api/chat
{
  "uuid": "business-uuid",
  "user_phone_number": "+919999999999",
  "user_query": "What are your hours?"
}`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-accent-700">0{index + 1}</p>
            <h2 className="font-serif text-xl text-ink-900">{step.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-700">{step.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
