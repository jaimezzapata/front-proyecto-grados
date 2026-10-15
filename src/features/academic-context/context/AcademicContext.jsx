import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { academicService } from '../services/academicService';
import toast from 'react-hot-toast';

const AcademicContext = createContext(null);
const ACTIVE_COURSE_KEY = 'evalia_active_course';

export const AcademicProvider = ({ children }) => {
  const [misAsignaturas, setMisAsignaturas] = useState([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_COURSE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  /**
   * Carga las asignaturas asignadas al docente autenticado
   */
  const loadMisAsignaturas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await academicService.getMisAsignaturas();
      setMisAsignaturas(data);

      // Si hay asignaturas y no hay seleccionada previa (o la previa ya no existe), seleccionar la primera por defecto
      setSelectedAsignatura((current) => {
        if (!data || data.length === 0) {
          localStorage.removeItem(ACTIVE_COURSE_KEY);
          return null;
        }
        if (current && data.some((item) => (item.asignatura?.id || item.id) === (current.asignatura?.id || current.id))) {
          return current;
        }
        const defaultCourse = data[0];
        localStorage.setItem(ACTIVE_COURSE_KEY, JSON.stringify(defaultCourse));
        return defaultCourse;
      });
    } catch (error) {
      toast.error(error.message || 'Error al cargar las asignaturas del docente');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMisAsignaturas();
  }, [loadMisAsignaturas]);

  /**
   * Selecciona una asignatura activa
   */
  const selectAsignatura = (asignatura) => {
    setSelectedAsignatura(asignatura);
    if (asignatura) {
      localStorage.setItem(ACTIVE_COURSE_KEY, JSON.stringify(asignatura));
      const nombre = asignatura.asignatura?.nombre || asignatura.nombre || 'Asignatura';
      toast.success(`Contexto activo: ${nombre}`, { id: 'course-selection' });
    } else {
      localStorage.removeItem(ACTIVE_COURSE_KEY);
    }
  };

  /**
   * Vincula una nueva materia y refresca el listado
   */
  const vincularAsignatura = async (payload) => {
    try {
      const result = await academicService.vincularAsignatura(payload);
      toast.success('¡Asignatura vinculada exitosamente!');
      await loadMisAsignaturas();
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al vincular la asignatura');
      throw error;
    }
  };

  /**
   * Crea una nueva materia en el catálogo y la vincula de inmediato al docente
   */
  const crearYVincularAsignatura = async ({ programa_id, codigo, nombre, semestre, periodo_academico, grupo }) => {
    try {
      const nuevaAsignatura = await academicService.createAsignatura({
        programa_id: Number(programa_id),
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        semestre: semestre ? Number(semestre) : null
      });

      await academicService.vincularAsignatura({
        asignatura_id: nuevaAsignatura.id,
        periodo_academico: periodo_academico.trim(),
        grupo: grupo?.trim() || '01'
      });

      toast.success(`¡"${nombre}" creada y vinculada con éxito!`);
      await loadMisAsignaturas();
      return nuevaAsignatura;
    } catch (error) {
      toast.error(error.message || 'Error al crear y vincular la asignatura');
      throw error;
    }
  };

  const value = {
    misAsignaturas,
    selectedAsignatura,
    loading,
    refreshAsignaturas: loadMisAsignaturas,
    selectAsignatura,
    vincularAsignatura,
    crearYVincularAsignatura
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic debe ser utilizado dentro de un AcademicProvider');
  }
  return context;
};
