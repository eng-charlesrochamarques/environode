export function MetricCard({ icon: Icon, label, value, tone = "teal" }) {
  return <div className={`metric-card tone-${tone}`}><span className="metric-icon"><Icon size={19} /></span><span>{label}</span><strong>{value}</strong></div>;
}
