import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { getCurrentPeriod } from '../utils/academicUtils';
import { Calendar, Filter } from 'lucide-react';
import './courseCard.css';

/**
 * Selector desplegable para filtrar asignaturas por periodo académico
 */
export const PeriodFilterSelector = () => {
  const { selectedPeriod, availablePeriods, changePeriod } = useAcademic();
  const currentSystemPeriod = getCurrentPeriod();

  return (
    <div className="period-filter">
      <label htmlFor="period-filter-select" className="period-filter__label">
        <Calendar size={15} className="period-filter__icon" />
        <span>Periodo:</span>
      </label>
      <select
        id="period-filter-select"
        className="period-filter__select"
        value={selectedPeriod}
        onChange={(e) => changePeriod(e.target.value)}
        aria-label="Filtrar por periodo académico"
      >
        {availablePeriods.map((period) => (
          <option key={period} value={period}>
            {period} {period === currentSystemPeriod ? '(Actual)' : ''}
          </option>
        ))}
        <option value="ALL">Histórico Completo (Todos)</option>
      </select>
    </div>
  );
};
