import { useEffect, useState } from 'react';
import axios from 'axios';
import { Case } from '../types/NPCTypes';
const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;
export function useCasoClinico(id: string | undefined) {
  const [caso, setCaso] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCaso = async () => {
      try {
        const res = await axios.get(`http://"+${BACKEND_IP}+":3001/simulation/case/${id}`);
        setCaso(res.data);
      } catch (err) {
        setError('Error al cargar el caso clínico');
      } finally {
        setLoading(false);
      }
    };
    fetchCaso();
  }, [id]);

  return { caso, loading, error };
}
