import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academicService } from '../services/academicService';
import { examService } from '../../exam-generation/services/examService';
import { materialService } from '../../material-ingestion/services/materialService';
import { CourseDetailHeader } from '../components/CourseDetailHeader';
import { CourseExamsList } from '../components/CourseExamsList';
import { CourseMaterialsList } from '../../material-ingestion/components/CourseMaterialsList';
import { CreateExamModal } from '../components/CreateExamModal';
import { UploadMaterialModal } from '../../material-ingestion/components/UploadMaterialModal';
import { MaterialPreviewModal } from '../../material-ingestion/components/MaterialPreviewModal';
import { ExamReviewModal } from '../../exam-editor/components/ExamReviewModal';
import { Sparkles, FileText, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Pantalla orquestadora de Detalle de Materia/Grupo, Ingesta de Documentos y Evaluaciones con IA (SRP)
 */
export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [exams, setExams] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const [activeTab, setActiveTab] = useState('evaluaciones'); // 'evaluaciones' | 'materiales'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [preselectedMaterialId, setPreselectedMaterialId] = useState(null);
  const [selectedExamForReview, setSelectedExamForReview] = useState(null);

  // Cargar datos de la asignación y del curso
  const fetchCourseData = async () => {
    try {
      setLoadingCourse(true);
      const data = await academicService.getAsignacionById(id);
      setCourseData(data);
      return data;
    } catch {
      toast.error('No se pudo cargar la información del curso seleccionado');
      navigate('/dashboard');
      return null;
    } finally {
      setLoadingCourse(false);
    }
  };

  // Cargar evaluaciones ligadas a la asignatura
  const fetchExams = async (asignaturaId) => {
    if (!asignaturaId) return;
    try {
      setLoadingExams(true);
      const data = await examService.getEvaluaciones(asignaturaId);
      setExams(data || []);
    } catch {
      toast.error('Error al cargar las evaluaciones de la asignatura');
    } finally {
      setLoadingExams(false);
    }
  };

  // Cargar materiales de clase ligados a la asignatura
  const fetchMaterials = async (asignaturaId) => {
    if (!asignaturaId) return;
    try {
      setLoadingMaterials(true);
      const data = await materialService.getMaterialsByAsignatura(asignaturaId);
      setMaterials(data || []);
    } catch {
      toast.error('Error al cargar la documentación de la materia');
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const course = await fetchCourseData();
      if (course?.asignatura_id) {
        await Promise.all([
          fetchExams(course.asignatura_id),
          fetchMaterials(course.asignatura_id)
        ]);
      }
    };
    init();
  }, [id]);

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta evaluación? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await examService.deleteEvaluacion(examId);
      toast.success('Evaluación eliminada correctamente');
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch (error) {
      toast.error(error.message || 'No se pudo eliminar la evaluación');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('¿Deseas eliminar este documento y su texto procesado?')) {
      return;
    }
    try {
      await materialService.deleteMaterial(materialId);
      toast.success('Documento eliminado correctamente');
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    } catch (error) {
      toast.error(error.message || 'No se pudo eliminar el material');
    }
  };

  const handleSelectExam = (exam) => {
    const actual = exam?.evaluacion || exam;
    setSelectedExamForReview(actual);
  };

  if (loadingCourse) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <p>Cargando información de la materia...</p>
      </div>
    );
  }

  const asignatura = courseData?.asignatura || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Cabecera Institucional con Acciones Directas */}
      <CourseDetailHeader
        courseData={courseData}
        onBack={() => navigate('/dashboard')}
        onOpenCreateExam={() => setIsCreateModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* 2. Pestañas de Navegación Segmentada (Evaluaciones vs Documentación) */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '6px',
          boxShadow: 'var(--shadow-sm)',
          display: 'inline-flex',
          gap: 6,
          alignSelf: 'flex-start',
          flexWrap: 'wrap'
        }}
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'evaluaciones'}
          onClick={() => setActiveTab('evaluaciones')}
          style={{
            backgroundColor: activeTab === 'evaluaciones' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'evaluaciones' ? 'var(--primary-contrast)' : 'var(--text-primary)',
            border: activeTab === 'evaluaciones' ? 'var(--border-width) solid var(--border-color)' : 'var(--border-width) solid transparent',
            borderRadius: 'var(--border-radius-sm)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
            boxShadow: activeTab === 'evaluaciones' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Sparkles size={16} />
          <span>Evaluaciones ({exams.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'materiales'}
          onClick={() => setActiveTab('materiales')}
          style={{
            backgroundColor: activeTab === 'materiales' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'materiales' ? 'var(--primary-contrast)' : 'var(--text-primary)',
            border: activeTab === 'materiales' ? 'var(--border-width) solid var(--border-color)' : 'var(--border-width) solid transparent',
            borderRadius: 'var(--border-radius-sm)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
            boxShadow: activeTab === 'materiales' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <UploadCloud size={16} />
          <span>Documentación de Clase ({materials.length})</span>
        </button>
      </div>

      {/* 3. Contenido Dinámico según la Pestaña Activa */}
      {activeTab === 'evaluaciones' ? (
        <section aria-labelledby="evaluaciones-heading">
          <CourseExamsList
            exams={exams}
            loading={loadingExams}
            onOpenCreateExam={() => setIsCreateModalOpen(true)}
            onSelectExam={handleSelectExam}
            onDeleteExam={handleDeleteExam}
          />
        </section>
      ) : (
        <section aria-labelledby="materiales-heading">
          <CourseMaterialsList
            materials={materials}
            loading={loadingMaterials}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onDeleteMaterial={handleDeleteMaterial}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onGenerateFromMaterial={(mat) => {
              setPreselectedMaterialId(mat.id);
              setIsCreateModalOpen(true);
            }}
          />
        </section>
      )}

      {/* 4. Modal para Crear Evaluación con IA */}
      <CreateExamModal
        isOpen={isCreateModalOpen}
        asignaturaId={courseData?.asignatura_id}
        asignaturaNombre={asignatura.nombre || 'Asignatura'}
        materials={materials}
        preselectedMaterialId={preselectedMaterialId}
        onClose={() => {
          setIsCreateModalOpen(false);
          setPreselectedMaterialId(null);
        }}
        onExamCreated={async (result) => {
          const actualExam = result?.evaluacion || result;
          if (actualExam) {
            setExams((prev) => [actualExam, ...prev]);
            setSelectedExamForReview(actualExam);
          }
          setActiveTab('evaluaciones');
          if (courseData?.asignatura_id) {
            await fetchExams(courseData.asignatura_id);
          }
        }}
      />

      {/* 5. Modal para Cargar Documentación de Clase */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        asignaturaId={courseData?.asignatura_id}
        asignaturaNombre={asignatura.nombre || 'Asignatura'}
        onClose={() => setIsUploadModalOpen(false)}
        onMaterialUploaded={(newMaterial) => {
          setMaterials((prev) => [newMaterial, ...prev]);
          setActiveTab('materiales');
        }}
      />

      {/* 6. Modal para Previsualizar Texto Extraído del Documento */}
      <MaterialPreviewModal
        isOpen={Boolean(previewMaterial)}
        material={previewMaterial}
        onClose={() => setPreviewMaterial(null)}
      />

      {/* 7. Modal de Revisión Pedagógica, Aprobación e Impresión del Examen (Human-in-the-Loop) */}
      <ExamReviewModal
        isOpen={Boolean(selectedExamForReview)}
        examId={selectedExamForReview?.id}
        onClose={() => setSelectedExamForReview(null)}
        onStatusUpdated={(examId, newStatus) => {
          setExams((prev) =>
            prev.map((e) => (e.id === examId ? { ...e, estado: newStatus } : e))
          );
        }}
      />
    </div>
  );
};
