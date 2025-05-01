interface ListaConCargaProps<T> {
    data: T[];
    loading: boolean;
    error?: string;
    emptyMessage?: string;
    renderItem: (item: T) => React.ReactNode;
  }
  
  export const ListaConCarga = <T,>({
    data,
    loading,
    error,
    emptyMessage = "No hay elementos.",
    renderItem,
  }: ListaConCargaProps<T>) => {
    if (loading) return <LoadingMessage />;
    if (error) return <ErrorMessage />;
    if (data.length === 0) return <EmptyState text={emptyMessage} />;
  
    return (
      <ul className="space-y-0.5">
        {data.map((item, index) => (
          <li key={index}>{renderItem(item)}</li>
        ))}
      </ul>
    );
  };

  const LoadingMessage = ({ text = "Cargando..." }: { text?: string }) => (
    <p className="text-[#164a5f] font-bold animate-pulse text-xl">{text}</p>
  );

  const ErrorMessage = ({ text = "Ocurrió un error al cargar los datos." }: { text?: string }) => (
    <p className="text-red-600 text-xl">{text}</p>
  );
  
  const EmptyState = ({ text = "No hay datos disponibles." }: { text?: string }) => (
    <p className="text-gray-500 text-xl">{text}</p>
  );