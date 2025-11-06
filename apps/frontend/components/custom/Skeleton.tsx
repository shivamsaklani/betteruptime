export const Skeleton = ()=>{
return(
      <div className="space-y-8">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="space-y-2">
      <div className="h-8 w-64 bg-foreground/10 rounded animate-pulse" />
      <div className="h-4 w-96 bg-muted-foreground/20 rounded animate-pulse" />
    </div>
    <div className="h-10 w-32 bg-primary/10 rounded animate-pulse" />
  </div>

  {/* Statistics Cards */}
  <div className="grid gap-6 md:grid-cols-3">
    {[
      { bg: "bg-primary/10" },
      { bg: "bg-green-500/10" },
      { bg: "bg-red-500/10" },
    ].map((stat, i) => (
      <div
        key={i}
        className={`p-6 rounded-lg flex items-center gap-3 ${stat.bg} animate-pulse h-28`}
      >
        <div className="h-12 w-12 rounded-lg bg-foreground/10" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-20 bg-foreground/10 rounded" />
          <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    ))}
  </div>

  {/* Filters Card */}
  <div className="p-6 bg-card rounded-lg space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-background/10 rounded animate-pulse" />
      ))}
    </div>
  </div>

  {/* Table */}
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-12 bg-background/10 rounded animate-pulse flex items-center px-4"
      >
        <div className="h-12 w-full bg-muted-foreground/20 rounded" />
      </div>
    ))}
  </div>
</div>
)
}