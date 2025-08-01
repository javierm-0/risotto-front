// src/components/CasosDoc/EditarCasosFuncionalidad/EditarCasos.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Case,
  InteraccionType,
  RelatoType,
  OpcionType,
  OpcionesAsociadas,
} from "../../../types/NPCTypes";

import TestearNodos from "../../Test/TestearNodos";
import InteraccionDetalle from "../CrearCasosFuncionalidad/InteraccionDetalle";

import { UpdateCasoAux } from "../../../api/updateCasoAux";
import { validateCaseData } from "../../../utils/validationUtils";
import { ToastContainer } from "react-toastify";


interface EditarCasosProps{
  caseData : Case|null;
  setCaseData: React.Dispatch<React.SetStateAction<Case|null>>;
}

const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;
const EditarCasos: React.FC<EditarCasosProps> = ({caseData,setCaseData}) => {
  const navigate = useNavigate();
  const [alreadySent, setAlreadySent] = useState(false);
  const backurl = "http://"+BACKEND_IP+":3001/simulation/case/update/";
  
  useEffect(() => {
  if(!caseData)
    {
    navigate("/inicioDocente/verCasos/");
    }
  }, [caseData, navigate]);

  if(!caseData){
    return null;
  }
  
  //Validacion de formulario
  const isFormValid = validateCaseData(caseData);

  const onChangeInteraccionField = (
    interId: string,
    campo: keyof InteraccionType,
    valor: any
  ) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType & { id: string };
          if (inter.id !== interId) return inter;
          return { ...inter, [campo]: valor } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onDeleteInteraccion = (interId: string) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.filter((i) => {
          const inter = i as InteraccionType & { id: string };
          return inter.id !== interId;
        }),
      } as Case;
    });
  };

  const onAddRelato = (interId: string) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType;
          if (inter.id !== interId) return inter;
          const nuevaPregunta: RelatoType = {
            id: `${interId}-rel-${Date.now()}`,
            pregunta: "",
            texto: "",
            opciones: [],
          } as RelatoType;
          return { ...inter, preguntas: [...inter.preguntas, nuevaPregunta] } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onChangeRelatoField = (
    interId: string,
    relatoId: string,
    campo: keyof RelatoType,
    valor: any
  ) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType & { id: string };
          if (inter.id !== interId) return inter;
          return {
            ...inter,
            preguntas: inter.preguntas.map((r) => {
              const rel = r as RelatoType & { id: string };
              if (rel.id !== relatoId) return rel;
              return { ...rel, [campo]: valor } as RelatoType;
            }),
          } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onDeleteRelato = (interId: string, relatoId: string) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType & { id: string };
          if (inter.id !== interId) return inter;
          return {
            ...inter,
            preguntas: inter.preguntas.filter((r) => {
              const rel = r as RelatoType & { id: string };
              return rel.id !== relatoId;
            }),
          } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onAddOpcion = (interId: string, relatoId: string) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType & { id: string };
          if (inter.id !== interId) return inter;
          return {
            ...inter,
            preguntas: inter.preguntas.map((r) => {
              const rel = r as RelatoType & { id: string };
              if (rel.id !== relatoId) return rel;
              const nuevaOpcion: OpcionType & { id: string } = {
                id: `${relatoId}-opc-${Date.now()}`,
                texto: "",
                reaccion: "",
                OpcionesAsociadas: [{ esCorrecta: false, consecuencia: "" }],
              };
              return { ...rel, opciones: [...rel.opciones, nuevaOpcion] } as RelatoType;
            }),
          } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onDeleteOpcion = (
    interId: string,
    relatoId: string,
    opcionId: string
  ) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType;
          if (inter.id !== interId) return inter;
          return {
            ...inter,
            preguntas: inter.preguntas.map((r) => {
              const rel = r as RelatoType;
              if (rel.id !== relatoId) return rel;
              return {
                ...rel,
                opciones: rel.opciones.filter((o) => {
                  const opc = o as OpcionType;
                  return opc.id !== opcionId;
                }),
              } as RelatoType;
            }),
          } as InteraccionType;
        }),
      } as Case;
    });
  };

  const onChangeOpcionField = (
    interId: string,
    relatoId: string,
    opcionId: string,
    campo: keyof OpcionType | keyof OpcionesAsociadas,
    valor: any
  ) => {
    setCaseData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interacciones: prev.interacciones.map((i) => {
          const inter = i as InteraccionType;
          if (inter.id !== interId) return inter;
          return {
            ...inter,
            preguntas: inter.preguntas.map((r) => {
              const rel = r as RelatoType;
              if (rel.id !== relatoId) return rel;
              return {
                ...rel,
                opciones: rel.opciones.map((o) => {
                  const opc = o as OpcionType;
                  if (opc.id !== opcionId) return opc;
                  if (campo === "texto" || campo === "reaccion") {
                    return { ...opc, [campo]: valor } as OpcionType;
                  }
                  const assoc = opc.OpcionesAsociadas[0] || {
                    esCorrecta: false,
                    consecuencia: "",
                  };
                  if (campo === "esCorrecta" || campo === "consecuencia") {
                    return {
                      ...opc,
                      OpcionesAsociadas: [{ ...assoc, [campo]: valor }],
                    } as OpcionType;
                  }
                  return opc;
                }),
              } as RelatoType;
            }),
          } as InteraccionType;
        }),
      } as Case;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#164a5f] p-4 border-b flex items-center justify-between">
        <button
          className="text-[#ffffff] hover:underline text-xl font-semibold hover:text-gray-400"
          onClick={() => navigate("/inicioDocente")}
        >
          ← Regresar al inicio
        </button>
        <span className="font-semibold text-white text-3xl">
          Caso: {caseData.titulo || "(sin título)"}
        </span>

        <button
          disabled={!isFormValid || alreadySent}
          className={`text-xl py-2 px-4 rounded ${
            isFormValid && !alreadySent
              ? "text-[#ffffff] hover:text-gray-400 hover:underline"
              : "text-[#164a5f]"
          }`}
          onClick={async () => {
            setAlreadySent(true);
            const wasUpdated : boolean = await UpdateCasoAux(backurl, caseData);
            if(wasUpdated){
              setAlreadySent(true);
            }
            else{
              setAlreadySent(false);
            }
          }}
        >
          → Guardar Cambios
        </button>
      </header>

      <div className="flex-1">
        <Routes>
          {/* 1) Ruta INDEX: /inicioDocente/editarCasos/:caseId */}
          <Route
            index
            element={
              <TestearNodos
                caseId={caseData._id!}
                caseData={caseData}
                setCaseData={setCaseData as React.Dispatch<React.SetStateAction<Case>>}
                basePath="/inicioDocente/verCasos/editarCasos"
              />
            }
          />

          {/* 2) Subruta detalle: /inicioDocente/editarCasos/:caseId/interacciones/:idInteraccion */}
          <Route
            path="interacciones/:idInteraccion"
            element={
              <InteraccionDetalle
                basePath="/inicioDocente/verCasos/editarCasos"
                caseData={caseData}
                actualizarCampoInteraccion={onChangeInteraccionField}
                eliminarInteraccion={(id) => {
                  onDeleteInteraccion(id);
                  navigate(`/inicioDocente/editarCasos/${caseData._id}`);
                }}
                agregarRelato={onAddRelato}
                actualizarCampoRelato={onChangeRelatoField}
                eliminarRelato={onDeleteRelato}
                actualizarCampoOpcion={onChangeOpcionField}
                eliminarOpcion={onDeleteOpcion}
                agregarOpcion={onAddOpcion}
              />
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditarCasos;
