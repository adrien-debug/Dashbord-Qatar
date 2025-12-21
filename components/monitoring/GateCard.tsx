// ============================================================================
// GATE CARD - Visual representation of validation gates
// Shows gate status, criteria, and blockers
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gate, GateStatus, GATE_STATUS_COLORS } from '../../types/sop';

interface GateCardProps {
  gate: Gate;
  isActive?: boolean;
  animationDelay?: number;
}

export const GateCard: React.FC<GateCardProps> = ({
  gate,
  isActive = false,
  animationDelay = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColor = GATE_STATUS_COLORS[gate.status];
  
  const completedCriteria = gate.criteria.filter(c => c.completed).length;
  const totalCriteria = gate.criteria.length;

  const getGateIcon = (status: GateStatus) => {
    switch (status) {
      case 'passed': return '🔓';
      case 'pending': return '🔒';
      case 'blocked': return '🚫';
      case 'not-applicable': return '⏸️';
      default: return '❓';
    }
  };

  const getStatusText = (status: GateStatus) => {
    switch (status) {
      case 'passed': return 'PASSED';
      case 'pending': return 'PENDING';
      case 'blocked': return 'BLOCKED';
      case 'not-applicable': return 'N/A';
      default: return status.toUpperCase();
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: gate.status === 'passed' 
          ? 'linear-gradient(145deg, rgba(138, 253, 129, 0.1) 0%, rgba(22, 33, 62, 1) 100%)'
          : gate.status === 'blocked'
          ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(22, 33, 62, 1) 100%)'
          : 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
        border: `2px solid ${statusColor}40`,
        boxShadow: isActive ? `0 0 20px ${statusColor}30` : 'none',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated Border for Active Gate */}
      {gate.status === 'pending' && isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            border: `2px solid ${statusColor}`,
            boxShadow: `0 0 15px ${statusColor}50`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Lock Animation for Passed Gates */}
      {gate.status === 'passed' && (
        <motion.div
          className="absolute top-4 right-4 text-4xl opacity-20"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: animationDelay + 0.3 }}
        >
          🔓
        </motion.div>
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-3xl"
              animate={gate.status === 'pending' ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {getGateIcon(gate.status)}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{gate.name}</h3>
              <p className="text-sm text-gray-400">{gate.phase.replace('-', ' ')}</p>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            className="px-3 py-1.5 rounded-full font-bold text-sm"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
              boxShadow: `0 0 10px ${statusColor}30`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: animationDelay + 0.2 }}
          >
            {getStatusText(gate.status)}
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4">{gate.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Criteria Met</span>
            <span className="text-white font-bold">{completedCriteria}/{totalCriteria}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: statusColor }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCriteria / totalCriteria) * 100}%` }}
              transition={{ duration: 1, delay: animationDelay }}
            />
          </div>
        </div>

        {/* Criteria List */}
        <button
          className="w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Gate Criteria</span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            >
              {gate.criteria.map((criterion, index) => (
                <motion.div
                  key={criterion.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: criterion.completed ? statusColor : 'transparent',
                      border: `2px solid ${criterion.completed ? statusColor : '#6B7280'}`,
                      color: criterion.completed ? '#000' : '#6B7280',
                    }}
                  >
                    {criterion.completed ? '✓' : ''}
                  </div>
                  <span className={`text-sm ${criterion.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                    {criterion.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blockers (if any) */}
        {gate.blockers && gate.blockers.length > 0 && (
          <motion.div
            className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.3 }}
          >
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
              <span>⚠️</span>
              <span>Blockers</span>
            </div>
            <ul className="space-y-1">
              {gate.blockers.map((blocker, index) => (
                <li key={index} className="text-sm text-red-300/80 flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  {blocker}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Approval Info (if passed) */}
        {gate.status === 'passed' && gate.approvedBy && (
          <motion.div
            className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.3 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">Approved by: {gate.approvedBy}</span>
              {gate.approvedAt && (
                <span className="text-green-300/60">{gate.approvedAt}</span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// GATE TIMELINE - Show all gates in sequence
// ============================================================================

interface GateTimelineProps {
  gates: Gate[];
}

export const GateTimeline: React.FC<GateTimelineProps> = ({ gates }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🚪</span>
        <span>Validation Gates</span>
      </h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
        
        {/* Gates */}
        <div className="space-y-4">
          {gates.map((gate, index) => (
            <div key={gate.id} className="relative flex gap-4">
              {/* Dot on the line */}
              <motion.div
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: GATE_STATUS_COLORS[gate.status],
                  boxShadow: `0 0 15px ${GATE_STATUS_COLORS[gate.status]}50`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {gate.status === 'passed' ? '✓' : gate.status === 'pending' ? '⏳' : '🚫'}
              </motion.div>
              
              {/* Gate Card */}
              <div className="flex-1">
                <GateCard 
                  gate={gate} 
                  isActive={gate.status === 'pending'}
                  animationDelay={index * 0.1}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GateCard;

