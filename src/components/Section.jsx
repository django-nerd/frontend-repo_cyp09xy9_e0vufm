export default function Section({ title, description, children, right }) {
  return (
    <section className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-white font-semibold">{title}</h2>
          {description && <p className="text-sm text-slate-300/80 mt-1">{description}</p>}
        </div>
        {right}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </section>
  )
}
