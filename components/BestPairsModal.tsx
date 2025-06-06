// components/BestPairsModal.tsx
'use client'

import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Zap } from 'lucide-react'

interface Match {
  match_with: string
  reason: string
}

interface Pairing {
  person: string
  matches: Match[]
}

interface BestPairsModalProps {
  isOpen: boolean
  onClose: () => void
  pairsData: { pairings?: Pairing[]; error?: string } | null
  isLoading: boolean
  currentUser?: string
}

export function BestPairsModal({
  isOpen,
  onClose,
  pairsData,
  isLoading,
  currentUser,
}: BestPairsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Outer wrapper with very high z-index */}
          <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-[#0A0B1A]/90 to-[#1A1B3A]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#A18CD1] mr-2" />
                  <h2 className="text-2xl font-bold text-white">Best Pairs</h2>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Error Message */}
                {!isLoading && pairsData?.error && (
                  <p className="text-center text-red-400 mb-4">{pairsData.error}</p>
                )}

                {/* Pairings List */}
                {!isLoading && pairsData?.pairings && (
                  <div className="space-y-6">
                    {pairsData.pairings.map((pair, idx) => (
                      <motion.div
                        key={idx}
                        className="p-4 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] rounded-2xl border border-[#A18CD1]/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className={`text-lg font-semibold ${
                              pair.person === currentUser ? 'text-[#6A82FB]' : 'text-white'
                            }`}
                          >
                            {pair.person}
                          </h3>
                          <motion.span
                            className="flex items-center text-xs px-2 py-1 bg-[#A18CD1]/20 text-[#D1CCF0] rounded-full"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                            }}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            MATCHES
                          </motion.span>
                        </div>
                        <ul className="space-y-2">
                          {pair.matches.map((m, mi) => (
                            <li key={mi} className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[#D1CCF0]/70 font-bold">With:</span>
                                <span className="text-white">{m.match_with}</span>
                              </div>
                              <p className="text-[#D1CCF0] text-sm italic">
                                Reason: {m.reason}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* No Data Fallback */}
                {!isLoading && !pairsData?.error && !pairsData?.pairings && (
                  <p className="text-center text-[#D1CCF0]">No pairing data available.</p>
                )}
              </div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}
