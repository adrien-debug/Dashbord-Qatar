// ============================================================================
// LIFECYCLE TIMELINE - Interactive 7-Phase Timeline
// Visualization of the Master SOP lifecycle phases
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phase, 
  PhaseId, 
  STATUS_COLORS, 
  PHASE_ICONS 
} from '../../types/sop';

interface LifecycleTimelineProps {
  phases: Phase[];
  currentPhase: PhaseId;
  onPhaseSelect?: (phase: Phase) => void;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({
  phases,
  currentPhase,
  onPhaseSelect,
}) => {
  const [hoveredPhase, setHoveredPhase] = useState<PhaseId | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<PhaseId | null>(null);

  const getPhaseColor = (phase: Phase) => {
    if (phase.id === currentPhase) return '#3B82F6'; // Blue for current
    return STATUS_COLORS[phase.status];
  };

  const isPhaseActive = (phase: Phase) => {
    return phase.id === currentPhase;
  };

  const isPhasePast = (phase: Phase) => {
    return phase.status === 'completed';
  };

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase.id === selectedPhase ? null : phase.id);
    onPhaseSelect?.(phase);
  };

  return (
    <div className="w-full py-8">
      {/* Main Timeline Container */}
      <div className="relative">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 rounded-full transform -translate-y-1/2" />
        
        {/* Progress Track */}
        <motion.div 
          className="absolute top-1/2 left-0 h-2 rounded-full transform -translate-y-1/2"
          style={{ 
            background: 'linear-gradient(90deg, #8AFD81 0%, #3B82F6 100%)',
            boxShadow: '0 0 20px rgba(138, 253, 129, 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${((phases.findIndex(p => p.id === currentPhase) + 1) / phases.length) * 100}%` 
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Phase Nodes */}
        <div className="relative flex justify-between items-center">
          {phases.map((phase, index) => (
            <div 
              key={phase.id}
              className="relative flex flex-col items-center"
              style={{ width: `${100 / phases.length}%` }}
            >
              {/* Connector Line (except first) */}
              {index > 0 && (
                <motion.div
                  className="absolute top-1/2 right-1/2 h-1 transform -translate-y-1/2"
                  style={{
                    width: '100%',
                    background: isPhasePast(phases[index - 1]) 
                      ? 'linear-gradient(90deg, #8AFD81, #8AFD81)'
                      : 'transparent',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isPhasePast(phases[index - 1]) ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )}

              {/* Phase Node */}
              <motion.button
                className="relative z-10 flex items-center justify-center rounded-full border-4 transition-all duration-300 cursor-pointer"
                style={{
                  width: isPhaseActive(phase) ? 70 : hoveredPhase === phase.id ? 60 : 50,
                  height: isPhaseActive(phase) ? 70 : hoveredPhase === phase.id ? 60 : 50,
                  backgroundColor: getPhaseColor(phase),
                  borderColor: isPhaseActive(phase) ? '#fff' : getPhaseColor(phase),
                  boxShadow: isPhaseActive(phase) 
                    ? `0 0 30px ${getPhaseColor(phase)}, 0 0 60px ${getPhaseColor(phase)}50`
                    : hoveredPhase === phase.id 
                      ? `0 0 20px ${getPhaseColor(phase)}80`
                      : 'none',
                }}
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
                onClick={() => handlePhaseClick(phase)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <span className="text-xl md:text-2xl">{phase.icon}</span>
                
                {/* Pulse Animation for Current Phase */}
                {isPhaseActive(phase) && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: getPhaseColor(phase) }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: getPhaseColor(phase) }}
                      animate={{ 
                        scale: [1, 2, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />
                  </>
                )}

                {/* Checkmark for Completed */}
                {phase.status === 'completed' && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>

              {/* Phase Label */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <p 
                  className="text-sm font-bold whitespace-nowrap"
                  style={{ 
                    color: isPhaseActive(phase) ? '#fff' : 
                           hoveredPhase === phase.id ? '#fff' : 
                           '#9CA3AF'
                  }}
                >
                  {phase.shortName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {phase.completionPercent}%
                </p>
              </motion.div>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {(hoveredPhase === phase.id || selectedPhase === phase.id) && (
                  <motion.div
                    className="absolute bottom-full mb-16 left-1/2 transform -translate-x-1/2 z-50"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl min-w-[250px]"
                      style={{
                        boxShadow: `0 0 30px ${getPhaseColor(phase)}30`,
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{phase.icon}</span>
                        <div>
                          <h4 className="font-bold text-white">{phase.name}</h4>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${getPhaseColor(phase)}30`,
                              color: getPhaseColor(phase),
                            }}
                          >
                            {phase.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-3">{phase.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-white font-bold">{phase.completionPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: getPhaseColor(phase) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${phase.completionPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Gate Status */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Gate:</span>
                        <span 
                          className="font-medium"
                          style={{ color: phase.gate.status === 'passed' ? '#8AFD81' : 
                                          phase.gate.status === 'pending' ? '#F59E0B' : 
                                          phase.gate.status === 'blocked' ? '#EF4444' : '#6B7280' }}
                        >
                          {phase.gate.name}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: phase.gate.status === 'passed' ? '#8AFD8130' : 
                                            phase.gate.status === 'pending' ? '#F59E0B30' : 
                                            phase.gate.status === 'blocked' ? '#EF444430' : '#6B728030',
                            color: phase.gate.status === 'passed' ? '#8AFD81' : 
                                   phase.gate.status === 'pending' ? '#F59E0B' : 
                                   phase.gate.status === 'blocked' ? '#EF4444' : '#6B7280',
                          }}
                        >
                          {phase.gate.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Dates if available */}
                      {phase.startDate && (
                        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
                          <div className="flex justify-between">
                            <span>Started:</span>
                            <span className="text-gray-400">{phase.startDate}</span>
                          </div>
                          {phase.endDate && (
                            <div className="flex justify-between mt-1">
                              <span>Completed:</span>
                              <span className="text-green-400">{phase.endDate}</span>
                            </div>
                          )}
                          {phase.estimatedDuration && (
                            <div className="flex justify-between mt-1">
                              <span>Duration:</span>
                              <span className="text-gray-400">{phase.estimatedDuration}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Arrow pointing down */}
                      <div 
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
                        style={{
                          borderLeft: '8px solid transparent',
                          borderRight: '8px solid transparent',
                          borderTop: '8px solid #1F2937',
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Order Labels */}
      <div className="flex justify-between mt-2 px-2">
        {phases.map((phase, index) => (
          <div 
            key={`order-${phase.id}`}
            className="text-center"
            style={{ width: `${100 / phases.length}%` }}
          >
            <span className="text-xs text-gray-600">
              Phase {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifecycleTimeline;

