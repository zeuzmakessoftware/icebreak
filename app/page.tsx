'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Users, MessageSquare, ChevronRight, Zap, Heart } from 'lucide-react'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Particle = {
  x0: number
  y0: number
  size: number
  x1: number
  y1: number
  duration: number
}

const questions = [
  "What's your favorite unconventional productivity hack?",
  'If you could work from any fictional location, where would it be?',
  "What's one skill you've picked up since working remotely?",
]

/** JSON data embedded in the code **/
const responsesData = [
  {
    name: '', // Will be filled with userName
    answers: ['', '', ''],
  },
  {
    name: 'Alex Morgan',
    answers: ['Pomodoro with 90min cycles', 'Hogwarts Library', 'Sign language basics'],
  },
  {
    name: 'Jane Doe',
    answers: ['Cold showers in the morning', 'The Shire', 'Video editing'],
  },
  {
    name: 'Carlos Ruiz',
    answers: ['Standing desk rotations', 'Cybertron', '3D modeling'],
  },
]

function ParticleCanvas() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 80 }).map(() => {
      const x0 = Math.random() * 100
      const y0 = Math.random() * 100
      const size = Math.random() * 10 + 5
      const x1 = Math.random() * 100
      const y1 = Math.random() * 100
      const duration = Math.random() * 10 + 10

      return { x0, y0, size, x1, y1, duration }
    })

    setParticles(arr)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 [--particle-count:80]">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#A18CD1]/30 to-[#6A82FB]/30"
            initial={{
              x: `${p.x0}%`,
              y: `${p.y0}%`,
              opacity: 0.3,
              scale: p.size / 10,
            }}
            animate={{
              x: [`${p.x0}%`, `${p.x1}%`],
              y: [`${p.y0}%`, `${p.y1}%`],
              transition: {
                duration: p.duration,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut',
              },
            }}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function IcebreakApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  const magneticRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!magneticRef.current) return

    const btn = magneticRef.current
    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = btn.getBoundingClientRect()
      const x = e.clientX - (left + width / 2)
      const y = e.clientY - (top + height / 2)
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    }
    const onMouseLeave = () => {
      btn.style.transform = 'translate(0, 0)'
    }
    btn.addEventListener('mousemove', onMouseMove)
    btn.addEventListener('mouseleave', onMouseLeave)
    return () => {
      btn.removeEventListener('mousemove', onMouseMove)
      btn.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // Update responsesData[0].name whenever userName changes
  useEffect(() => {
    responsesData[0].name = userName
  }, [userName])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0B1A] via-[#1A1B3A] to-[#2A2B5A] overflow-hidden"
    >
      <ParticleCanvas />

      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[radial-gradient(circle_at_center,#A18CD155_0%,transparent_70%)] blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 30, 0],
            transition: {
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,#6A82FB55_0%,transparent_70%)] blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            transition: {
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <AnimatePresence mode="wait">
          {currentStep <= questions.length ? (
            <motion.div
              key="step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="max-w-md mx-auto"
            >
              <motion.div
                style={{ scale, opacity }}
                className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] rounded-3xl border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
              >
                <div className="relative p-[1px] rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#A18CD1_0%,#6A82FB_50%,#A18CD1_100%)] opacity-30 animate-[spin_6s_linear_infinite]" />
                  <div className="relative bg-gradient-to-br from-[#0A0B1A]/80 to-[#1A1B3A]/80 rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-white/10 relative overflow-hidden">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-8"
                      >
                        <motion.h1
                          className="text-5xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#FFFFFF_0%,#D1CCF0_50%,#FFFFFF_100%)] tracking-tight"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%'],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          Icebreak
                        </motion.h1>
                        <motion.p
                          className="text-[#E0DFFB] mt-2 text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {currentStep === 0
                            ? 'Enter Your Name'
                            : `Question ${currentStep} of ${questions.length}`}
                        </motion.p>
                      </motion.div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-8">
                      {currentStep === 0 ? (
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-white/5 border-none focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl py-6 px-4 text-white placeholder:text-transparent peer shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all"
                            placeholder=" "
                          />
                          <motion.label
                            className="absolute left-4 top-1/2 -translate-y-1/12 text-[#D1CCF0]/70 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                            layout
                          >
                            Name...
                          </motion.label>
                          <motion.button
                            ref={magneticRef}
                            onClick={() => {
                              if (userName.trim()) {
                                setCurrentStep(1)
                              }
                            }}
                            disabled={!userName.trim()}
                            className="mt-6 w-full py-6 bg-[linear-gradient(90deg,#A18CD1_0%,#6A82FB_100%)] hover:shadow-[0_0_20px_5px_rgba(161,140,209,0.5)] transition-all duration-300 border-none rounded-xl text-white font-medium text-base relative overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              Next <ChevronRight className="ml-2 h-4 w-4" />
                            </span>
                            <span className="absolute inset-0 overflow-hidden">
                              <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/20 group-hover:w-[200%] group-hover:h-[200%] group-hover:opacity-0 transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2" />
                            </span>
                            <span className="absolute inset-0 rounded-xl overflow-hidden">
                              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFFFF_0%,transparent_70%)] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            </span>
                          </motion.button>
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            className="p-6 rounded-xl overflow-hidden relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <div className="absolute inset-0 overflow-hidden opacity-20">
                              <svg
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                              >
                                <motion.path
                                  fill="#A18CD1"
                                  d="M47.5,-59.5C59.8,-50.2,67,-32.8,69.2,-14.9C71.4,3.1,68.6,21.6,57.1,35.1C45.6,48.6,25.4,57.1,3.7,54.8C-18.1,52.5,-36.2,39.4,-47.8,22.9C-59.4,6.4,-64.5,-13.5,-57.3,-29.3C-50.1,-45.1,-30.6,-56.8,-9.9,-53.5C10.8,-50.1,21.6,-31.6,31.5,-17.2C41.3,-2.8,50.2,7.6,47.5,-59.5Z"
                                  animate={{
                                    d: [
                                      'M47.5,-59.5C59.8,-50.2,67,-32.8,69.2,-14.9C71.4,3.1,68.6,21.6,57.1,35.1C45.6,48.6,25.4,57.1,3.7,54.8C-18.1,52.5,-36.2,39.4,-47.8,22.9C-59.4,6.4,-64.5,-13.5,-57.3,-29.3C-50.1,-45.1,-30.6,-56.8,-9.9,-53.5C10.8,-50.1,21.6,-31.6,31.5,-17.2C41.3,-2.8,50.2,7.6,47.5,-59.5Z',
                                      'M38.8,-50.8C52.3,-42.7,66.8,-32.2,70.1,-18.8C73.4,-5.4,65.5,10.8,54.8,24.2C44.1,37.6,30.6,48.2,14.3,54.8C-2.1,61.4,-20.3,64.1,-34.3,56.6C-48.3,49.1,-58,31.5,-62.4,11.9C-66.8,-7.6,-65.9,-29.1,-54.2,-41.5C-42.5,-53.9,-20.3,-57.1,-2.2,-55.5C15.9,-53.8,31.8,-47.2,38.8,-50.8Z',
                                      'M45.4,-56.3C59.8,-48.3,73.2,-35.4,76.4,-20.3C79.6,-5.2,72.6,12.1,61.1,26.8C49.6,41.5,33.6,53.6,15.3,60.2C-3.1,66.8,-23.8,67.8,-39.4,58.9C-55,50,-65.5,31.1,-68.6,10.4C-71.7,-10.3,-67.4,-32.9,-53.8,-46.1C-40.2,-59.3,-17.4,-63.1,0.5,-63.5C18.3,-63.9,36.7,-60.9,45.4,-56.3Z',
                                    ],
                                  }}
                                  transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                  }}
                                  style={{
                                    transform: 'translate(100px, 100px) scale(1.2)',
                                  }}
                                />
                              </svg>
                            </div>
                            <div className="flex items-start space-x-3 relative z-10">
                              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Sparkles className="h-5 w-5 text-white" />
                              </div>
                              <p className="text-white font-medium text-lg">
                                {questions[currentStep - 1]}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Input
                              value={answers[currentStep - 1]}
                              onChange={(e) => {
                                const newAnswers = [...answers]
                                newAnswers[currentStep - 1] = e.target.value
                                setAnswers(newAnswers)
                              }}
                              className="bg-white/5 border-none focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl py-6 px-4 text-white placeholder:text-transparent peer shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all"
                              placeholder=" "
                            />
                            <motion.label
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1CCF0]/70 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                              layout
                            >
                              Type your answer...
                            </motion.label>
                          </motion.div>

                          <motion.button
                            ref={magneticRef}
                            onClick={() => {
                              if (currentStep < questions.length) {
                                setCurrentStep(currentStep + 1)
                              } else {
                                responsesData[0].answers = [...answers]
                                setCurrentStep(questions.length + 1)
                              }
                            }}
                            disabled={!answers[currentStep - 1]}
                            className="w-full py-6 bg-[linear-gradient(90deg,#A18CD1_0%,#6A82FB_100%)] hover:shadow-[0_0_20px_5px_rgba(161,140,209,0.5)] transition-all duration-300 border-none rounded-xl text-white font-medium text-base relative overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              {currentStep < questions.length ? (
                                <>
                                  Next Question <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                'See Connections'
                              )}
                            </span>
                            <span className="absolute inset-0 overflow-hidden">
                              <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/20 group-hover:w-[200%] group-hover:h-[200%] group-hover:opacity-0 transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2" />
                            </span>
                            <span className="absolute inset-0 rounded-xl overflow-hidden">
                              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFFFF_0%,transparent_70%)] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            </span>
                          </motion.button>
                        </>
                      )}
                    </CardContent>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center bg-[linear-gradient(90deg,#A18CD1_0%,#6A82FB_100%)] p-3 rounded-full mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  <Users className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#FFFFFF_0%,#D1CCF0_50%,#FFFFFF_100%)] mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Team Responses
                </motion.h2>
                <motion.p
                  className="text-[#E0DFFB] text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Here’s what everyone answered to each question
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {responsesData.map((person, idx) => (
                  <motion.div
                    key={idx}
                    className={`backdrop-blur-md ${
                      person.name === userName
                        ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_100%)] border-2 border-white/20'
                        : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_100%)] border-2 border-[#A18CD1]/50'
                    } rounded-2xl p-6 relative overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6A82FB_0%,transparent_70%)] opacity-10" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-xl">{person.name}</h3>
                        {person.name !== userName ? (
                          <motion.span
                            className="bg-[#A18CD1]/30 text-[#D1CCF0] text-xs px-3 py-1 rounded-full flex items-center"
                            animate={{
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                            }}
                          >
                            <Zap className="h-3 w-3 mr-1 fill-current" />
                            OTHER
                          </motion.span>
                        ) : (
                          <motion.span
                            className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center"
                            animate={{
                              boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 10px rgba(255,255,255,0)'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeOut',
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1 fill-current" />
                            YOU
                          </motion.span>
                        )}
                      </div>
                      <ul className="space-y-3">
                        {questions.map((q, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + idx * 0.1 + i * 0.1 }}
                          >
                            <div className="mr-3 text-[#D1CCF0] font-bold">{i + 1}.</div>
                            <div>
                              <div className="text-[#D1CCF0] text-sm italic">{q}</div>
                              <div className="text-white">{person.answers[i] || 'Not answered'}</div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12 text-center relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-[#A18CD1]"
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                      animate={{
                        x: Math.sin((i * 45 * Math.PI) / 180) * 30,
                        y: Math.cos((i * 45 * Math.PI) / 180) * 30,
                        opacity: [0, 0.3, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: 'easeInOut',
                        delay: i * 0.1,
                      }}
                      style={{ width: '6px', height: '6px' }}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setCurrentStep(0)
                    setUserName('')
                    setAnswers(Array(questions.length).fill(''))
                  }}
                  className="relative overflow-hidden py-5 px-8 text-white hover:text-white border border-white/20 hover:border-white/40 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all group"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Restart</span>
                  </span>
                  <span className="absolute inset-0 overflow-hidden rounded-xl">
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[shimmer_2s_infinite]" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}