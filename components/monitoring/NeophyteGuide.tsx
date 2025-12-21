// ============================================================================
// NEOPHYTE GUIDE - Interactive guide for newcomers
// Explains the SOP lifecycle in simple, accessible terms
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseId, DimensionId, PHASE_NAMES, DIMENSION_NAMES, PHASE_ICONS, DIMENSION_ICONS } from '../../types/sop';

interface GuideStep {
  id: string;
  title: string;
  emoji: string;
  description: string;
  details: string[];
  learnMore?: string;
}

const guideSteps: GuideStep[] = [
  {
    id: 'what-is-sop',
    title: "What is a Master SOP?",
    emoji: "📖",
    description: "A Master SOP (Standard Operating Procedure) is like a playbook that ensures every step of building a Bitcoin mining facility is done correctly, in the right order, with proper approvals.",
    details: [
      "Think of it as a recipe for building a mining facility",
      "It defines WHO does WHAT and WHEN",
      "It ensures nothing important is forgotten",
      "It creates accountability at every step",
    ],
  },
  {
    id: 'phases',
    title: "The 7 Lifecycle Phases",
    emoji: "🎯",
    description: "Every Bitcoin mining facility goes through 7 distinct phases, from initial idea to daily operations. Each phase must be completed before moving to the next.",
    details: [
      "1. Strategic Intent - Why are we doing this?",
      "2. Pre-Conception - Is this even feasible?",
      "3. Conception - Let's design everything properly",
      "4. Industrialisation - Get everything ready to build",
      "5. Deployment - Actually build it!",
      "6. Commissioning - Test and verify everything works",
      "7. Steady-State - Keep it running smoothly",
    ],
  },
  {
    id: 'dimensions',
    title: "The 4 Mandatory Dimensions",
    emoji: "🎲",
    description: "Every phase must address 4 different aspects. A phase is NOT complete unless ALL 4 dimensions are validated.",
    details: [
      "💼 Business - Money, strategy, stakeholders",
      "📋 Administrative - Legal, permits, compliance",
      "💻 Technology - Software, monitoring, automation",
      "⚙️ Engineering - Hardware, construction, infrastructure",
    ],
  },
  {
    id: 'gates',
    title: "Validation Gates",
    emoji: "🚪",
    description: "Between each phase, there's a 'gate' - a checkpoint where someone must formally approve moving forward. No gate approval = no progress.",
    details: [
      "Gates prevent rushing into the next phase unprepared",
      "Named owners must sign off on each gate",
      "Evidence must be documented",
      "If criteria aren't met, the gate stays closed",
    ],
  },
  {
    id: 'sub-sops',
    title: "Sub-SOPs",
    emoji: "📑",
    description: "The Master SOP references detailed sub-documents (Sub-SOPs) that contain the nitty-gritty details for specific topics.",
    details: [
      "SOP-BUS-FIN-001: Financial modeling details",
      "SOP-ADM-REG-001: Regulatory compliance procedures",
      "SOP-TECH-ARCH-001: Technology architecture specs",
      "Each sub-SOP has its own owner and approval process",
    ],
  },
  {
    id: 'status-colors',
    title: "Understanding Status Colors",
    emoji: "🎨",
    description: "Colors tell you instantly what's happening. Learn them once, understand everything at a glance.",
    details: [
      "🟢 Green = Complete, all good!",
      "🔵 Blue = Currently in progress",
      "🟡 Amber/Yellow = At risk, needs attention",
      "🔴 Red = Blocked, cannot proceed",
      "⚫ Gray = Not started yet",
    ],
  },
];

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white shadow-xl max-w-xs">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// NEOPHYTE GUIDE PANEL
// ============================================================================

interface NeophyteGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NeophyteGuide: React.FC<NeophyteGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'tour' | 'reference'>('tour');

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 z-50 overflow-hidden shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎓</span>
                  <h2 className="text-xl font-bold text-white">Neophyte Guide</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'tour' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('tour')}
                >
                  📚 Guided Tour
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'reference' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('reference')}
                >
                  📖 Quick Reference
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
              {viewMode === 'tour' ? (
                <div className="space-y-6">
                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    {guideSteps.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentStep 
                            ? 'bg-blue-500 scale-125' 
                            : index < currentStep 
                              ? 'bg-green-500' 
                              : 'bg-gray-600'
                        }`}
                        onClick={() => setCurrentStep(index)}
                      />
                    ))}
                  </div>

                  {/* Current Step */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-6">
                        <span className="text-6xl">{guideSteps[currentStep].emoji}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white text-center mb-4">
                        {guideSteps[currentStep].title}
                      </h3>
                      
                      <p className="text-gray-300 text-center mb-6 leading-relaxed">
                        {guideSteps[currentStep].description}
                      </p>

                      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                        {guideSteps[currentStep].details.map((detail, i) => (
                          <motion.div
                            key={i}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="text-blue-400">•</span>
                            <span className="text-gray-300">{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentStep === 0
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      ← Previous
                    </button>
                    
                    <span className="text-gray-500 self-center">
                      {currentStep + 1} / {guideSteps.length}
                    </span>

                    {currentStep < guideSteps.length - 1 ? (
                      <button
                        onClick={nextStep}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition-all"
                      >
                        Got it! ✓
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // Reference View
                <div className="space-y-4">
                  {guideSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className="bg-gray-800/50 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{step.emoji}</span>
                        <h4 className="font-bold text-white">{step.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </motion.div>
                  ))}

                  {/* Quick Legend */}
                  <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span>🎨</span> Color Legend
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span className="text-gray-300">Complete</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500" />
                        <span className="text-gray-300">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500" />
                        <span className="text-gray-300">At Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <span className="text-gray-300">Blocked</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// HELP BUTTON (Floating)
// ============================================================================

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg z-30 flex items-center justify-center"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-2xl">❓</span>
      
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-400"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
};

export default NeophyteGuide;

