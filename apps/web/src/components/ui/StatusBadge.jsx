const labels = { online: "Ativa", warning: "Atenção", offline: "Sem conexão" };

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}
