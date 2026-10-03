interface PageHeaderProps {
  title: string
  intro?: string
  eyebrow?: string
}

export function PageHeader({ title, intro, eyebrow }: PageHeaderProps) {
  return (
    <div className="on-dark honeycomb bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold text-balance sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty">{intro}</p>}
      </div>
    </div>
  )
}
