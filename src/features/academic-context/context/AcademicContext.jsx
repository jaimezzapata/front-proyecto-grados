import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { academicService } from '../services/academicService';
import { getCurrentPeriod, getAvailablePeriods } from '../utils/academicUtils';
import toast from 'react-hot-toast';

const AcademicContext = createContext(null);
const ACTIVE_COURSE_KEY = 'evalia_active_course';

export const AcademicProvider = ({ children }) => {
  const [allAsignaturas, setAllAsignaturas] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod);
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
   * Carga todas las asignaciones de asignaturas del docente autenticado
   */
  const loadMisAsignaturas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await academicService.getMisAsignaturas();
      setAllAsignaturas(data || []);

      // Validar o autoasignar materia activa
      setSelectedAsignatura((current) => {
        if (!data || data.length === 0) {
          localStorage.removeItem(ACTIVE_COURSE_KEY);
          return null;
        }

        // Si ya había una seleccionada y sigue existiendo la misma asignación exacta (mismo id de asignación)
        if (current) {
          const match = data.find((item) => item.id === current.id);
          if (match) return match;
        }

        // Si no, tomar la primera asignación
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
   * Periodos disponibles calculados dinámicamente
   */
  const availablePeriods = useMemo(() => {
    return getAvailablePeriods(allAsignaturas);
  }, [allAsignaturas]);

  /**
   * Asignaturas filtradas según el periodo seleccionado (o todas si es 'ALL')
   */
  const misAsignaturas = useMemo(() => {
    if (selectedPeriod === 'ALL') {
      return allAsignaturas;
    }
    return allAsignaturas.filter(
      (course) => course.periodo_academico === selectedPeriod
    );
  }, [allAsignaturas, selectedPeriod]);

  /**
   * Cambia el periodo académico de visualización
   */
  const changePeriod = (period) => {
    setSelectedPeriod(period);
  };

  /**
   * Selecciona una asignatura activa (curso y grupo específico)
   */
  const selectAsignatura = (courseAssignment) => {
    setSelectedAsignatura(courseAssignment);
    if (courseAssignment) {
      localStorage.setItem(ACTIVE_COURSE_KEY, JSON.stringify(courseAssignment));
      const asig = courseAssignment.asignatura || courseAssignment;
      const nombre = asig?.nombre || 'Asignatura';
      const grupo = courseAssignment.grupo ? `(Grupo ${courseAssignment.grupo})` : '';
      toast.success(`Contexto activo: ${nombre} ${grupo}`.trim(), { id: 'course-selection' });
    } else {
      localStorage.removeItem(ACTIVE_COURSE_KEY);
    }
  };

  /**
   * Vincula una materia existente y refresca
   */
  const vincularAsignatura = async (payload) => {
    try {
      const result = await academicService.vincularAsignatura(payload);
      toast.success('¡Asignatura vinculada exitosamente!');
      
      // Sincronizar el periodo con el de la materia vinculada
      if (payload.periodo_academico) {
        setSelectedPeriod(payload.periodo_academico);
      }
      
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
      
      if (periodo_academico) {
        setSelectedPeriod(periodo_academico.trim());
      }
      
      await loadMisAsignaturas();
      return nuevaAsignatura;
    } catch (error) {
      toast.error(error.message || 'Error al crear y vincular la asignatura');
      throw error;
    }
  };

  /**
   * Actualiza una asignación de curso existente (grupo, sede, modalidad, jornada, periodo o materia)
   */
  const actualizarAsignatura = async (id, payload) => {
    try {
      const updated = await academicService.updateMisAsignatura(id, payload);
      toast.success('¡Asignatura actualizada exitosamente!');

      setSelectedAsignatura((current) => {
        if (current && current.id === id) {
          localStorage.setItem(ACTIVE_COURSE_KEY, JSON.stringify(updated));
          return updated;
        }
        return current;
      });

      await loadMisAsignaturas();
      return updated;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar la asignatura');
      throw error;
    }
  };

  /**
   * Desvincula una asignación de curso del docente
   */
  const desvincularAsignatura = async (id) => {
    try {
      await academicService.deleteMisAsignatura(id);
      toast.success('Asignatura desvinculada correctamente');

      setSelectedAsignatura((current) => {
        if (current && current.id === id) {
          localStorage.removeItem(ACTIVE_COURSE_KEY);
          return null;
        }
        return current;
      });

      await loadMisAsignaturas();
    } catch (error) {
      toast.error(error.message || 'Error al desvincular la asignatura');
      throw error;
    }
  };

  const value = {
    allAsignaturas,
    misAsignaturas,
    selectedAsignatura,
    selectedPeriod,
    availablePeriods,
    loading,
    refreshAsignaturas: loadMisAsignaturas,
    changePeriod,
    selectAsignatura,
    vincularAsignatura,
    crearYVincularAsignatura,
    actualizarAsignatura,
    desvincularAsignatura
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
