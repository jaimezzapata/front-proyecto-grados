import React, { useEffect } from 'react';
import { MapPin, Briefcase, Clock } from 'lucide-react';

/**
 * Componente atómico y reutilizable (DRY) para los campos de configuración institucional CESDE:
 * Sede, Modalidad, Jornada, Periodo Académico y Grupo.
 */
export const CesdeConfigFields = ({
  sede,
  setSede,
  modalidad,
  setModalidad,
  jornada,
  setJornada,
  periodo,
  setPeriodo,
  grupo,
  setGrupo,
  idPrefix = 'cesde'
}) => {
  // En modalidad Empresarial en CESDE solo aplica Mañana o Tarde
  useEffect(() => {
    if (modalidad === 'Empresarial' && jornada === 'Noche') {
      setJornada('Tarde');
    }
  }, [modalidad, jornada, setJornada]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '14px',
        backgroundColor: 'var(--bg-surface-hover)',
        borderRadius: 'var(--border-radius-sm)',
        border: 'var(--border-width) solid var(--border-subtle)'
      }}
    >
      <div
        style={{
          fontSize: '0.74rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)'
        }}
      >
        Configuración Institucional CESDE
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10
        }}
      >
        {/* Sede */}
        <div className="modal-form-group">
          <label
            htmlFor={`${idPrefix}-sede`}
            className="modal-label"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <MapPin size={13} style={{ color: 'var(--primary-color)' }} /> Sede
          </label>
          <select
            id={`${idPrefix}-sede`}
            className="modal-select"
            value={sede}
            onChange={(e) => setSede(e.target.value)}
          >
            <option value="Medellín">Medellín</option>
            <option value="Bello">Bello</option>
          </select>
        </div>

        {/* Modalidad */}
        <div className="modal-form-group">
          <label
            htmlFor={`${idPrefix}-modalidad`}
            className="modal-label"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Briefcase size={13} style={{ color: 'var(--primary-color)' }} /> Modalidad
          </label>
          <select
            id={`${idPrefix}-modalidad`}
            className="modal-select"
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
          >
            <option value="Regular">Regular</option>
            <option value="Empresarial">Empresarial</option>
          </select>
        </div>

        {/* Jornada */}
        <div className="modal-form-group">
          <label
            htmlFor={`${idPrefix}-jornada`}
            className="modal-label"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Clock size={13} style={{ color: 'var(--primary-color)' }} /> Jornada
          </label>
          <select
            id={`${idPrefix}-jornada`}
            className="modal-select"
            value={jornada}
            onChange={(e) => setJornada(e.target.value)}
          >
            <option value="Mañana">Mañana (AM)</option>
            <option value="Tarde">Tarde (PM)</option>
            {modalidad === 'Regular' && <option value="Noche">Noche</option>}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Periodo */}
        <div className="modal-form-group">
          <label htmlFor={`${idPrefix}-periodo`} className="modal-label">
            Periodo Académico
          </label>
          <input
            id={`${idPrefix}-periodo`}
            type="text"
            className="modal-input"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="Ej. 2026-2"
            required
          />
        </div>

        {/* Grupo */}
        <div className="modal-form-group">
          <label htmlFor={`${idPrefix}-grupo`} className="modal-label">
            Grupo / Salón
          </label>
          <input
            id={`${idPrefix}-grupo`}
            type="text"
            className="modal-input"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            placeholder="Ej. 01, 02 o MED-AM-01"
            required
          />
        </div>
      </div>
    </div>
  );
};
