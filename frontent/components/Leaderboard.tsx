type Item = { name: string; subtitle: string; score: number }

export function Leaderboard({ items }: { items: Item[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.name} className="flex items-center justify-between rounded-xl bg-[var(--bg)] p-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold flex-shrink-0">
              {idx + 1}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[var(--text)] truncate">{item.name}</div>
              <div className="text-[10px] text-[var(--muted)] truncate">{item.subtitle}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs font-semibold text-[var(--text)]">{item.score}%</div>
            <div className="text-[9px] text-[var(--muted)]">match</div>
          </div>
        </div>
      ))}
    </div>
  )
}
