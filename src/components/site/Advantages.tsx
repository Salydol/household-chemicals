import { ShieldCheck, Tag, Truck, Headphones, Factory, Sparkles, Package, Star } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  shield: ShieldCheck,
  tag: Tag,
  truck: Truck,
  headphones: Headphones,
  factory: Factory,
  sparkles: Sparkles,
  package: Package,
  star: Star,
};

export const ICON_OPTIONS = Object.keys(ICONS);

type Item = { id: number; title: string; text: string; icon: string };

export function Advantages({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? ShieldCheck;
        return (
          <div key={item.id} className="flex items-start gap-3.5 bg-surface p-6">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
              <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </span>
            <div>
              <h3 className="text-[15px] font-bold leading-snug">{item.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{item.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
