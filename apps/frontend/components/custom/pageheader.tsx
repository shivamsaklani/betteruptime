const PageHeader = ({
  children,
  title,
  subtitle,
}: {
  children?: React.ReactNode
  title: string
  subtitle?: string
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  )
}

export default PageHeader
