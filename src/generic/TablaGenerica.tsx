interface Columna<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => React.ReactNode;
  }
  
  interface TablaGenericaProps<T> {
    data: T[];
    columns: Columna<T>[];
    loading?: boolean;
    error?: string;
    emptyMessage?: string;
  }
  
  export const TablaGenerica = <T,>({
    data,
    columns,
    loading = false,
    error,
    emptyMessage = "No hay datos disponibles.",
  }: TablaGenericaProps<T>) => {
    if (loading) return <p className="text-[#164a5f] font-bold animate-pulse">Cargando...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (data.length === 0) return <p className="text-gray-500">{emptyMessage}</p>;
  
    return (
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-[#164a5f]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border px-4 py-2">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="text-[#164a5f] text-justify">
              {columns.map((col, j) => (
            <td
            key={j}
            className={`border ${
              col.header === 'Título del caso' ? 'px-32 text-[#164a5f] font-semibold' : '' }`} 
              >
            {col.render ? col.render(item) : (item[col.accessor] as React.ReactNode)}
            </td>

          ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  