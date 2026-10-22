import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import { getUserFullName } from '../../../core/utils/userUtils';
import { DashboardStatsCards } from '../../../core/layout/DashboardStatsCards';
import { AcademicWorkspace } from './AcademicWorkspace';

/**
 * Vista de inicio del Dashboard docente (SRP)
 * Despliega banner de bienvenida, métricas clave (KPIs) y el espacio de trabajo de asignaturas.
 */
export const DashboardHomePage = () => {
  const { user } = useAuth();
  const { openProgramsModal, openLinkModal } = useOutletContext();

  return (
    <>
      {/* Banner de Bienvenida */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1 className="dashboard-title">
            ¡Hola de nuevo, {getUserFullName(user)}!
          </h1>
          <p className="dashboard-subtitle">
            Panel de control docente • Formación Técnica Laboral CESDE
          </p>
        </div>
      </div>

      {/* Cards de Métricas / KPIs del Panel de Control */}
      <DashboardStatsCards
        onOpenProgramsModal={openProgramsModal}
        onOpenLinkModal={openLinkModal}
      />

      {/* Cards y Workspace interactivo de Asignaturas */}
      <AcademicWorkspace />
    </>
  );
};
