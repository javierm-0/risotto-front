// src/components/CasosDoc/CrearCasosFuncionalidad/CrearCasosPrincipal.tsx
import React, { useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";

import TestearNodos from "../../Test/TestearNodos";
import InteraccionDetalle from "./InteraccionDetalle";

import {
  Case,
  InteraccionType,
  RelatoType,
  OpcionType,
  OpcionesAsociadas,
} from "../../../types/NPCTypes";
import { validateCaseData } from "../../../utils/validationUtils";
import { CrearCaso } from "../../../api/crearCasoAux";
import { ToastContainer } from "react-toastify";
const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;


const CrearCasosPrincipal: React.FC = () => {
  // 1) Extraer caseId de la URL padre: /inicioDocente/crearCasos/:caseId/*
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [alreadySent,setAlreadySent] = useState<boolean>(false);
  const backurl: string = "http://"+BACKEND_IP+":3001/simulation/case/create";
  

  // 2) Estado principal `caseData`
  const [caseData, setCaseData] = useState<Case>({
    _id: caseId || "nuevoCaso",
    titulo: "",
    tipo_caso: "Urgencia",
    contexto_inicial: {
      descripcion: "",
      informacion_paciente: {
        nombre: "",
        edad: 0,
        diagnostico_previo: "",
        diagnostico_actual: [],
        antecedentes_relevantes: [],
      },
    },
    interacciones: [],
    informacion_final_caso: "",
  });

  // ————— HANDLERS DE INTERACCIÓN —————
  const onChangeInteraccionField = (
    interId: string,
    campo: keyof InteraccionType,
    valor: string
  ) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) =>
        i.id === interId ? { ...i, [campo]: valor } : i
      ),
    }));
  };

  const onDeleteInteraccion = (interId: string) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.filter((i) => i.id !== interId),
    }));
  };

  const onAddRelato = (interId: string) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        const nuevoRelato: RelatoType = {
          id: Date.now().toString(),
          pregunta: "",
          texto: "",
          opciones: [],
        };
        return { ...i, preguntas: [...i.preguntas, nuevoRelato] };
      }),
    }));
  };

  // ————— HANDLERS DE RELATO —————
  const onChangeRelatoField = (
    interId: string,
    relatoId: string,
    campo: keyof RelatoType,
    valor: string
  ) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        return {
          ...i,
          preguntas: i.preguntas.map((r) =>
            r.id === relatoId ? { ...r, [campo]: valor } : r
          ),
        };
      }),
    }));
  };

  const onDeleteRelato = (interId: string, relatoId: string) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        return {
          ...i,
          preguntas: i.preguntas.filter((r) => r.id !== relatoId),
        };
      }),
    }));
  };

  // ————— HANDLERS DE OPCIÓN —————
  const onAddOpcion = (interId: string, relatoId: string) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        return {
          ...i,
          preguntas: i.preguntas.map((r) => {
            if (r.id !== relatoId) return r;
            const nuevaOpcion: OpcionType = {
              id: Date.now().toString(),
              texto: "",
              reaccion: "",
              OpcionesAsociadas: [{ esCorrecta: false }],
            };
            return { ...r, opciones: [...r.opciones, nuevaOpcion] };
          }),
        };
      }),
    }));
  };

  const onDeleteOpcion = (
    interId: string,
    relatoId: string,
    opcionId: string
  ) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        return {
          ...i,
          preguntas: i.preguntas.map((r) => {
            if (r.id !== relatoId) return r;
            return {
              ...r,
              opciones: r.opciones.filter((o) => o.id !== opcionId),
            };
          }),
        };
      }),
    }));
  };

  const onChangeOpcionField = (
    interId: string,
    relatoId: string,
    opcionId: string,
    campo: keyof OpcionType | keyof OpcionesAsociadas,
    valor: any
  ) => {
    setCaseData((prev) => ({
      ...prev,
      interacciones: prev.interacciones.map((i) => {
        if (i.id !== interId) return i;
        return {
          ...i,
          preguntas: i.preguntas.map((r) => {
            if (r.id !== relatoId) return r;
            return {
              ...r,
              opciones: r.opciones.map((o) => {
                if (o.id !== opcionId) return o;
                // Modificar campo de OpcionType
                if (campo === "texto" || campo === "reaccion") {
                  return { ...o, [campo]: valor };
                }
                // Modificar campo de OpcionesAsociadas (primer elemento)
                const assoc = o.OpcionesAsociadas[0] || { esCorrecta: false };
                if (campo === "esCorrecta" || campo === "consecuencia") {
                  return {
                    ...o,
                    OpcionesAsociadas: [{ ...assoc, [campo]: valor }],
                  };
                }
                return o;
              }),
            };
          }),
        };
      }),
    }));
  };

  
  const isFormValid : boolean = validateCaseData(caseData);

  const onCreateCaseClick = async () =>{
    const hasCreatedCase = await CrearCaso(backurl, caseData);
    if(hasCreatedCase){
      setAlreadySent(true);
    }
    else{
      setAlreadySent(false);
    }
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

         <button disabled={!isFormValid || alreadySent} className={`text-xl py-2 px-4 rounded 
                                  ${isFormValid && !alreadySent? 'text-[#ffffff] hover:text-gray-400 hover:underline' : 'text-[#164a5f]' } `}
                            onClick={() => {
                              setAlreadySent(true);//con esto deberia apagarse hasta recargar la pagina, prevenimos spam de casos                              
                              onCreateCaseClick();
                              }}>
                                →Finalizar Creación de Caso
          </button>
      </header>

      <div className="flex-1">
        <Routes>
          {/* 
            1) Ruta INDEX: /inicioDocente/crearCasos/:caseId 
               → Renderiza TestearNodos y le pasa caseId
          */}
          <Route
            index
            element={
              <TestearNodos
                caseId={caseData._id!}
                caseData={caseData}
                setCaseData={setCaseData}
                basePath="/inicioDocente/crearCasos"
                
              />
            }
          />

          {/*
            2) Ruta DETALLE: /inicioDocente/crearCasos/:caseId/interacciones/:idInteraccion
               → Renderiza InteraccionDetalle con todos los handlers
          */}
         <Route
            path="interacciones/:idInteraccion"
            element={
              <InteraccionDetalle
                caseData={caseData}
                basePath="/inicioDocente/crearCasos"
                actualizarCampoInteraccion={onChangeInteraccionField}
                eliminarInteraccion={onDeleteInteraccion}
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

export default CrearCasosPrincipal;
