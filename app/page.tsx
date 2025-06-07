// page.tsx (Corrected)
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Users, MessageSquare, ChevronRight, Zap } from 'lucide-react'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BestPairsModal } from '@/components/BestPairsModal'
import { Button } from '@/components/ui/button'
import { AdminDashboard } from '@/components/AdminDashboard' // Import AdminDashboard

type Particle = {
  x0: number
  y0: number
  size: number
  x1: number
  y1: number
  duration: number
}

interface AllResultItem {
  id?: string;
  _id: string;
  score?: number;
  fields: {
    person: string;
    question: string;
    answer: string;
  };
}

interface Match {
  match_with: string;
  reason: string;
}

interface Pairing {
  person: string;
  matches: Match[];
}

const allQuestions = [
  "Are you a dog person or a cat person?",
  "What's your go-to comfort food?",
  "If you could have any superpower, what would it be?",
  "Are you an early bird or a night owl?",
  "What's the best concert you've ever been to?",
  "If you could travel anywhere in the world right now, where would you go?",
  "What's your favorite way to unwind after a long day?",
  "Sweet or savory snacks?",
  "What's a skill you've always wanted to learn?",
  "Are you more of a spontaneous adventurer or a meticulous planner?",
  "What's the funniest movie you've ever seen?",
  "Do you prefer coffee, tea, or something else to kickstart your day?",
  "What's one small thing that always makes your day better?",
  "If you were a professional athlete, what sport would you play?",
  "Beach vacation or mountain retreat?",
  "What's a book you'd recommend to everyone?",
  "Do you prefer to listen to music while you work, or do you need silence?",
  "What's the most unusual thing you've ever eaten?",
  "If you could instantly become an expert in any one subject, what would it be?",
  "Are you more likely to binge-watch a show or watch episodes one by one?",
  "What's your favorite season and why?",
  "If you could meet any historical figure, who would it be?",
  "What's your dream car (or mode of transportation)?",
  "Are you a fan of board games, video games, or both?",
  "What's your favorite type of weather?",
  "If you could only eat one cuisine for the rest of your life, what would it be?",
  "What's one place you've visited that exceeded your expectations?",
  "Do you prefer reading a physical book or an e-reader?",
  "What's your favorite type of exercise or physical activity?",
  "If you had a personal chef, what would they cook for you most often?",
  "What's a TV show you've recently binged?",
  "Are you good at remembering names or faces?",
  "What's the bravest thing you've ever done?",
  "If you could live in any fictional world, which one would it be?",
  "What's your favorite holiday?",
  "Do you prefer a quiet night in or a lively night out?",
  "What's a unique talent you have?",
  "Are you more of a morning person or an evening person when it comes to creativity?",
  "What's your favorite type of music to relax to?",
  "If you could learn any language fluently, which would it be?",
  "What's the most interesting fact you know?",
  "Do you prefer sweet or salty popcorn?",
  "What's a random act of kindness you've done or witnessed?",
  "If you won the lottery, what's the first thing you'd do?",
  "What's your favorite type of outdoor activity?",
  "Are you a good cook, or do you prefer to eat out?",
  "What's a historical event you'd love to witness?",
  "Do you prefer hot drinks or cold drinks?",
  "What's a piece of technology you can't live without?",
  "If you had a theme song, what would it be?",
  "What's your favorite type of art (painting, sculpture, music, etc.)?",
  "Do you prefer texting or calling?",
  "What's the most beautiful place you've ever seen?",
  "If you could trade lives with any celebrity for a day, who would it be?",
  "What's your favorite thing to do on a rainy day?",
  "Are you a good dancer?",
  "What's a unique hobby you have?",
  "Do you prefer to learn by doing, or by reading/listening?",
  "What's your favorite type of dessert?",
  "If you could have dinner with any three people, living or dead, who would they be?",
  "What's the most challenging thing you've ever learned?",
  "Do you prefer to work alone or in a team?",
  "What's your ideal weekend activity?",
  "If you could invent anything, what would it be?",
  "What's your favorite type of sandwich?",
  "Are you a fan of puzzles (jigsaw, crosswords, etc.)?",
  "What's a travel essential you never leave home without?",
  "Do you prefer a busy city or a quiet countryside?",
  "What's your favorite type of footwear?",
  "If you could only watch one genre of movies for the rest of your life, what would it be?",
  "What's a hidden gem restaurant you love?",
  "Are you a better speaker or listener?",
  "What's the most adventurous food you've ever tried?",
  "If you had to pick a theme for your life, what would it be?",
  "What's your favorite form of exercise that doesn't feel like exercise?",
  "Do you prefer to drive or be a passenger on road trips?",
  "What's a cause you're passionate about?",
  "If you could master any musical instrument, which would it be?",
  "What's your favorite type of salad dressing?",
  "Are you a fan of stand-up comedy?",
  "What's the best piece of advice you've ever received?",
  "Do you prefer digital or physical photos?",
  "What's your favorite app on your phone?",
  "If you could teleport anywhere for a day, where would you go?",
  "What's your favorite type of pizza topping?",
  "Are you good at remembering jokes?",
  "What's a personal goal you're currently working on?",
  "Do you prefer sunrise or sunset?",
  "What's a famous landmark you'd love to visit?",
  "If you could have a conversation with your future self, what would you ask?",
  "What's your favorite childhood memory?",
  "Do you prefer to give or receive gifts?",
  "What's a skill you'd like to improve this year?",
  "If you could spend a day doing anything you wanted, what would it be?",
  "What's your favorite type of flower?",
  "Are you a fan of reality TV?",
  "What's a surprising fact about you?",
  "Do you prefer a strict routine or going with the flow?",
  "What's one thing you're grateful for today?",
  "If your life were a song, what would its title be?"
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
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [similarResults, setSimilarResults] = useState<AllResultItem[]>([])
  const [allResults, setAllResults] = useState<AllResultItem[]>([])
  const [bestPairs, setBestPairs] = useState<{ pairings?: Pairing[]; error?: string } | null>(null)
  const [isGeneratingPairs, setIsGeneratingPairs] = useState<boolean>(false)
  const [isPairsModalOpen, setIsPairsModalOpen] = useState<boolean>(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false) // NEW: State for admin panel visibility

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

  const fetchSimilar = () => {
    const queryText = answers.join(' ')
    fetch(`/api/fetchRecords?q=${encodeURIComponent(queryText)}&kAmount=2`)
      .then(res => res.json())
      .then(res => setSimilarResults(res.data.result.hits || []))
  }

  const fetchAll = () => {
    const queryText = answers.join(' ')
    fetch(`/api/fetchRecords?q=${encodeURIComponent(queryText)}&kAmount=40`)
      .then(res => res.json())
      .then(res => setAllResults(res.data.result.hits.slice(2, 42) || []))
  }

  useEffect(() => {
    if (currentStep === selectedQuestions.length + 1) {
      fetchSimilar()
      fetchAll()
    }
  }, [currentStep, userName, answers])

  const handleGeneratePairs = async () => {
    if (!userName || answers.length < selectedQuestions.length) {
      console.error('Cannot generate pairs without user name and all answers.')
      setBestPairs({ error: 'Please provide your name and answer all selected questions before generating pairs.' })
      setIsGeneratingPairs(false)
      return false
    }
    setIsGeneratingPairs(true)
    setBestPairs(null)
    try {
      const response = await fetch('/api/generatePairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser: { name: userName, questions: selectedQuestions, answers },
          allUsersData: allResults,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to generate pairs from API')
      }

      if (responseData.success) {
        if (responseData.pairs && Array.isArray(responseData.pairs.pairings)) {
          setBestPairs({ pairings: responseData.pairs.pairings });
        } else {
          console.error('LLM response structure for pairs is not as expected. Expected .pairs.pairings to be an array. Received:', responseData.pairs);
          setBestPairs({ error: 'Received malformed pairing data from AI. The structure was not as expected.' });
        }
      } else {
        setBestPairs({ error: responseData.error || 'Unknown error from API' });
      }
      return true
    } catch (error) {
      console.error('Error generating pairs:', error)
      setBestPairs({ error: (error as Error).message })
      return false
    } finally {
      setIsGeneratingPairs(false)
    }
  }

  const openPairsModalAndGenerate = async () => {
    setIsPairsModalOpen(true)
    await handleGeneratePairs()
  }

  const pickThreeQuestions = () => {
    const copy = [...allQuestions]
    const picked: string[] = []
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * copy.length)
      picked.push(copy.splice(idx, 1)[0]!)
    }
    return picked
  }

  return (
    <>
      {/* Toggle Button (top-right corner) */}
      <button
        className="fixed top-4 right-4 z-30 p-2 bg-[#A18CD1] rounded-full text-white shadow-lg hover:bg-[#6A82FB] transition-colors duration-300"
        onClick={() => setIsAdminOpen(true)}
      >
        Admin
      </button>

      {/* Conditional Render */}
      {isAdminOpen ? (
        <AdminDashboard
          userName={userName}
          selectedQuestions={selectedQuestions}
          answers={answers}
          similarResults={similarResults}
          allResults={allResults}
          bestPairs={bestPairs}
          isGeneratingPairs={isGeneratingPairs}
          isPairsModalOpen={isPairsModalOpen}
          openPairsModalAndGenerate={openPairsModalAndGenerate}
          onCloseAdmin={() => setIsAdminOpen(false)} // Pass a function to close the admin dashboard
        />
      ) : (
        /* your existing IcebreakApp JSX */
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
              {currentStep <= selectedQuestions.length ? (
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
                              Connectify
                            </motion.h1>
                            <motion.p
                              className="text-[#E0DFFB] mt-2 text-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {currentStep === 0
                                ? 'Enter Your Name'
                                : `Question ${currentStep} of ${selectedQuestions.length}`}
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
                                className="absolute left-4 top-1/2 -translate-y-1/12 text-[#D1CCF0]/70 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs opacity-20"
                                layout
                              >
                                Name...
                              </motion.label>
                              <motion.button
                                ref={magneticRef}
                                onClick={() => {
                                  if (userName.trim()) {
                                    const picked = pickThreeQuestions()
                                    setSelectedQuestions(picked)
                                    setAnswers(Array(picked.length).fill(''))
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
                                    {selectedQuestions[currentStep - 1]}
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
                                  if (currentStep < selectedQuestions.length) {
                                    setCurrentStep(currentStep + 1)
                                  } else {
                                    setCurrentStep(selectedQuestions.length + 1)
                                  }
                                }}
                                disabled={!answers[currentStep - 1]}
                                className="w-full py-6 bg-[linear-gradient(90deg,#A18CD1_0%,#6A82FB_100%)] hover:shadow-[0_0_20px_5px_rgba(161,140,209,0.5)] transition-all duration-300 border-none rounded-xl text-white font-medium text-base relative overflow-hidden group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="relative z-10 flex items-center justify-center">
                                  {currentStep < selectedQuestions.length ? (
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
                      Similar Matches
                    </motion.h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {similarResults.map((item) => (
                      <motion.div
                        key={item._id}
                        className="backdrop-blur-md bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_100%)] border-2 border-[#A18CD1]/50 rounded-2xl p-6 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + similarResults.indexOf(item) * 0.2 }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6A82FB_0%,transparent_70%)] opacity-10" />
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white text-xl">{item.fields?.person || 'Unknown'}</h3>
                            <motion.span
                              className="bg-[#A18CD1]/30 text-[#D1CCF0] text-xs px-3 py-1 rounded-full flex items-center"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                            >
                              <Zap className="h-3 w-3 mr-1 fill-current" />
                              MATCH
                            </motion.span>
                          </div>
                          <ul className="space-y-3">
                            <motion.li className="flex items-start">
                              <div className="mr-3 text-[#D1CCF0] font-bold">Q:</div>
                              <div className="text-[#D1CCF0] text-sm italic">{item.fields?.question}</div>
                            </motion.li>
                            <motion.li className="flex items-start">
                              <div className="mr-3 text-[#D1CCF0] font-bold">A:</div>
                              <div className="text-white">{item.fields?.answer}</div>
                            </motion.li>
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center">
                    <motion.h2
                      className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#FFFFFF_0%,#D1CCF0_50%,#FFFFFF_100%)] mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      All Q&A
                    </motion.h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {allResults.map((item) => (
                      <motion.div
                        key={item._id}
                        className="backdrop-blur-md bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_100%)] border-2 border-[#A18CD1]/50 rounded-2xl p-6 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + allResults.indexOf(item) * 0.05 }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6A82FB_0%,transparent_70%)] opacity-10" />
                        <div className="relative z-10">
                          <ul className="space-y-3">
                            <motion.li className="flex items-start">
                              <div className="text-white">{item.fields?.person}</div>
                            </motion.li>
                            <motion.li className="flex items-start">
                              <div className="mr-3 text-[#D1CCF0] font-bold">Q:</div>
                              <div className="text-[#D1CCF0] text-sm italic">{item.fields?.question}</div>
                            </motion.li>
                            <motion.li className="flex items-start">
                              <div className="mr-3 text-[#D1CCF0] font-bold">A:</div>
                              <div className="text-white">{item.fields?.answer}</div>
                            </motion.li>
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
                        setSelectedQuestions([])
                        setAnswers([])
                        setSimilarResults([])
                        setAllResults([])
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
          <BestPairsModal
            isOpen={isPairsModalOpen}
            onClose={() => setIsPairsModalOpen(false)}
            pairsData={bestPairs}
            isLoading={isGeneratingPairs}
            currentUser={userName}
          />
        </div>
      )}
    </>
  )
}