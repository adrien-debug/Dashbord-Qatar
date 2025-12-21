// ============================================================================
// DIMENSION CARD - Visual representation of the 4 mandatory dimensions
// Business, Administrative, Technology, Engineering
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dimension, STATUS_COLORS, DIMENSION_ICONS } from '../../types/sop';

interface DimensionCardProps {
  dimension: Dimension;
  isExpanded?: boolean;
  onToggle?: () => void;
  animationDelay?: number;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  isExpanded = false,
  onToggle,
  animationDelay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColor = STATUS_COLORS[dimension.status];
  const completedCount = dimension.criteria.filter(c => c.completed).length;
  const totalCount = dimension.criteria.length;

  // Circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (dimension.completionPercent / 100) * circumference;

  const getStatusLabel = () => {
    switch (dimension.status) {
      case 'completed': return 'COMPLETE';
      case 'in-progress': return 'IN PROGRESS';
      case 'not-started': return 'NOT STARTED';
      case 'blocked': return 'BLOCKED';
      case 'at-risk': return 'AT RISK';
      default: return dimension.status.toUpperCase();
    }
  };

  const getStatusIcon = () => {
    switch (dimension.status) {
      case 'completed': return '✓';
      case 'in-progress': return '◐';
      case 'not-started': return '○';
      case 'blocked': return '⛔';
      case 'at-risk': return '⚠';
      default: return '?';
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
        border: `2px solid ${isHovered ? statusColor : 'transparent'}`,
        boxShadow: isHovered ? `0 0 30px ${statusColor}40` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${statusColor} 0%, transparent 60%)`,
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-3xl"
              animate={{ 
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              {DIMENSION_ICONS[dimension.id]}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{dimension.name}</h3>
              <span 
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                {getStatusIcon()} {getStatusLabel()}
              </span>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={statusColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress }}
                transition={{ duration: 1.5, delay: animationDelay, ease: 'easeOut' }}
                style={{
                  filter: `drop-shadow(0 0 8px ${statusColor})`,
                }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelay + 0.5 }}
              >
                {dimension.completionPercent}%
              </motion.span>
              <span className="text-xs text-gray-500">
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Criteria List (Preview) */}
        <div className="space-y-2">
          {dimension.criteria.slice(0, isExpanded ? undefined : 3).map((criterion, index) => (
            <motion.div
              key={criterion.id}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{
                backgroundColor: criterion.completed ? `${statusColor}10` : 'rgba(55, 65, 81, 0.3)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + 0.1 * index }}
            >
              {/* Checkbox */}
              <motion.div
                className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                style={{
                  borderColor: criterion.completed ? statusColor : '#6B7280',
                  backgroundColor: criterion.completed ? statusColor : 'transparent',
                }}
                animate={!criterion.completed && dimension.status === 'in-progress' ? {
                  boxShadow: [
                    '0 0 0 0 rgba(251, 191, 36, 0)',
                    '0 0 0 8px rgba(251, 191, 36, 0.2)',
                    '0 0 0 0 rgba(251, 191, 36, 0)',
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {criterion.completed && (
                  <motion.svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                )}
              </motion.div>

              {/* Label */}
              <span 
                className="text-sm flex-1"
                style={{
                  color: criterion.completed ? '#D1D5DB' : '#9CA3AF',
                  textDecoration: criterion.completed ? 'none' : 'none',
                }}
              >
                {criterion.label}
              </span>

              {/* Blocked indicator */}
              {criterion.blockedBy && (
                <span className="text-xs text-red-400 bg-red-400/20 px-2 py-0.5 rounded">
                  Blocked
                </span>
              )}
            </motion.div>
          ))}

          {/* Show more indicator */}
          {!isExpanded && dimension.criteria.length > 3 && (
            <motion.div
              className="text-center py-2 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animationDelay + 0.4 }}
            >
              +{dimension.criteria.length - 3} more criteria
            </motion.div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animationDelay + 0.5 }}
        >
          <motion.div
            className="text-gray-500"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-1 w-full">
        <motion.div
          className="h-full"
          style={{ backgroundColor: statusColor }}
          initial={{ width: 0 }}
          animate={{ width: `${dimension.completionPercent}%` }}
          transition={{ duration: 1, delay: animationDelay }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================================
// DIMENSION GRID - All 4 dimensions in a grid
// ============================================================================

interface DimensionGridProps {
  dimensions: Record<string, Dimension>;
  onDimensionSelect?: (dimension: Dimension) => void;
}

export const DimensionGrid: React.FC<DimensionGridProps> = ({
  dimensions,
  onDimensionSelect,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const dimensionArray = Object.values(dimensions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dimensionArray.map((dimension, index) => (
        <DimensionCard
          key={dimension.id}
          dimension={dimension}
          isExpanded={expandedId === dimension.id}
          onToggle={() => {
            setExpandedId(expandedId === dimension.id ? null : dimension.id);
            onDimensionSelect?.(dimension);
          }}
          animationDelay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default DimensionCard;

