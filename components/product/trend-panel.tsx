import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function buildPoints(values: Array<number | null>) {
  const defined = values.filter((value): value is number => value !== null);

  if (defined.length === 0) {
    return "";
  }

  const min = Math.min(...defined);
  const max = Math.max(...defined);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const normalized = value === null ? 0.5 : (value - min) / range;
      const y = 70 - normalized * 48;
      return `${x},${y}`;
    })
    .join(" ");
}

export function TrendPanel({
  label,
  value,
  subtitle,
  values,
}: {
  label: string;
  value: string;
  subtitle: string;
  values: Array<number | null>;
}) {
  const polyline = buildPoints(values);

  return (
    <Card className="border-[#E2E8F0] shadow-none">
      <CardHeader className="pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
          {label}
        </p>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <p className="text-sm text-[#64748B]">{subtitle}</p>
      </CardHeader>
      <CardContent>
        {polyline ? (
          <svg viewBox="0 0 100 70" className="h-20 w-full">
            <defs>
              <linearGradient id={`${label}-gradient`} x1="0" x2="1">
                <stop offset="0%" stopColor="#0F8F63" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <polyline
              points={polyline}
              fill="none"
              stroke="#0F8F63"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="flex h-20 items-center justify-center rounded-2xl bg-[#F8FAFC] text-sm text-[#94A3B8]">
            No data yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
