export function PageState({ loading, error, onRetry, children }) {
  if (loading) return <p className="page-state" role="status">Carregando...</p>;
  if (error) return <div className="page-state" role="alert"><p>{error}</p><button className="secondary-button" type="button" onClick={onRetry}>Tentar novamente</button></div>;
  return children;
}
