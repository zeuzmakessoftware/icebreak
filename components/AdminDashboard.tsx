// AdminDashboard.tsx
'use client'
import React, { useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TooltipProps } from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { BestPairsModal } from '@/components/BestPairsModal'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// --- Type Definitions ---

interface AllResultItem {
  id?: string;
  score?: number;
  fields: {
    person: string;
    question: string;
    answer: string;
  };
}

// For D3 Force-Directed Graph
interface NodeData {
  name: string;
  group: number;
}
interface SimulationNode extends d3.SimulationNodeDatum, NodeData {}

// For Recharts Bar Chart
interface ChartData {
  question: string;
  count: number;
}

// Match and Pairing interfaces for bestPairs data structure
interface Match {
  match_with: string;
  reason: string;
}

interface Pairing {
  person: string;
  matches: Match[];
}

// For the main component's props
interface AdminDashboardProps {
  userName?: string;
  selectedQuestions?: string[];
  answers?: string[];
  similarResults?: AllResultItem[];
  allResults: AllResultItem[];
  bestPairs: { pairings?: Pairing[]; error?: string; } | null;
  isGeneratingPairs: boolean;
  isPairsModalOpen: boolean;
  openPairsModalAndGenerate: () => void;
  onCloseAdmin: () => void;
}


const ForceDirectedConstellation: React.FC<{ data: NodeData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useGSAP(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 500
    const height = 400
    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`)

    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const simulation = d3.forceSimulation<SimulationNode>(data as SimulationNode[])
      .force('charge', d3.forceManyBody().strength(-1))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(30))
      .force('link', d3.forceLink<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>().id((d) => d.name).distance(70).strength(0.01));

    const linksData = data.length > 1 ? data.map((_, i) => ({
      source: data[i].name as unknown as SimulationNode,
      target: data[Math.floor(Math.random() * data.length)].name as unknown as SimulationNode,
    })) : [];

    const link = svg.append('g')
      .selectAll('line')
      .data(linksData)
      .enter().append('line')
      .attr('stroke', 'rgba(173, 216, 230, 0.2)')
      .attr('stroke-width', 1);

    const nodes = svg.append('g')
      .selectAll('circle')
      .data(data as SimulationNode[])
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', 'rgba(0, 255, 255, 0.7)')
      .attr('stroke', 'rgba(0, 255, 255, 1)')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('filter', 'url(#glow)')
      .call(drag(simulation));

    const labels = svg.append('g')
      .selectAll('text')
      .data(data as SimulationNode[])
      .enter().append('text')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('fill', '#E0DFFB')
      .attr('text-anchor', 'middle')
      .attr('dy', -18)
      .style('pointer-events', 'none')
      .style('text-shadow', '0 0 5px rgba(0, 255, 255, 0.8)');
    
    nodes.on('mouseenter', (event: MouseEvent) => {
        const node = d3.select(event.currentTarget as Element);
        gsap.to(node.node(), { r: 18, duration: 0.3, ease: 'back.out(4)' });
        gsap.to(node.node(), { fill: 'rgba(255, 105, 180, 1)', duration: 0.3 });
    }).on('mouseleave', (event: MouseEvent) => {
        const node = d3.select(event.currentTarget as Element);
        gsap.to(node.node(), { r: 10, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        gsap.to(node.node(), { fill: 'rgba(0, 255, 255, 0.7)', duration: 0.5 });
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimulationNode).x ?? 0)
        .attr('y1', d => (d.source as SimulationNode).y ?? 0)
        .attr('x2', d => (d.target as SimulationNode).x ?? 0)
        .attr('y2', d => (d.target as SimulationNode).y ?? 0);
      nodes
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);
      labels
        .attr('x', d => d.x ?? 0)
        .attr('y', d => d.y ?? 0);
    });

    function drag(simulation: d3.Simulation<SimulationNode, undefined>) {
        const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) => { if (!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; };
        const dragged = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) => { event.subject.fx = event.x; event.subject.fy = event.y; };
        const dragended = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) => { if (!event.active) simulation.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; };
        return d3.drag<SVGCircleElement, SimulationNode>().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }
    
    return () => simulation.stop();
  }, { scope: svgRef, dependencies: [data] });

  return <svg
    ref={svgRef}
    width={500}
    height={400}
    viewBox="0 0 500 400"
  />;
}

const StarlightBarChart: React.FC<{data: ChartData[]}> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-4 bg-black/50 backdrop-blur-lg border border-cyan-400/50 rounded-lg shadow-lg shadow-cyan-500/20 text-white">
                    <p className="font-bold text-cyan-300 text-lg">{`Question: "${label}"`}</p>
                    <p className="text-sm">{`Popularity: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF69B4" stopOpacity={0.9}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="question" tick={{ fill: 'rgba(224, 223, 251, 0.7)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(224, 223, 251, 0.7)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[10, 10, 0, 0]}>
                    {data.map((_entry, index) => (
                         <Cell key={`cell-${index}`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  allResults, bestPairs, isGeneratingPairs, isPairsModalOpen, openPairsModalAndGenerate, onCloseAdmin
}) => {
  const container = useRef<HTMLDivElement>(null);

  const forceData: NodeData[] = useMemo(() => {
    if (!allResults || allResults.length === 0) return [];
    const uniquePeople = [...new Set(allResults.map((item: AllResultItem) => item.fields.person))];
    return uniquePeople.map((person, index) => ({
      name: person,
      group: index % 4
    }));
  }, [allResults]);

  const questionPopularity: ChartData[] = useMemo(() => {
    if (!allResults || allResults.length === 0) return [];
    const counts = new Map<string, number>();
    allResults.forEach((item: AllResultItem) => {
      const question = item.fields.question;
      counts.set(question, (counts.get(question) || 0) + 1);
    });
    return Array.from(counts.entries())
        .map(([question, count]) => ({
            question,
            count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
  }, [allResults]);

  useGSAP(() => {
    gsap.fromTo('.dashboard-title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.data-card', 
        { opacity: 0, y: 50, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo('.cta-button', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 1.2 });
    gsap.fromTo('.close-button', { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
  }, { scope: container });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!container.current) return;
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = container.current;
    const xPos = (clientX / offsetWidth - 0.5) * 2;
    const yPos = (clientY / offsetHeight - 0.5) * 2;
    
    gsap.to('.data-card', {
        rotationY: xPos * 5,
        rotationX: -yPos * 5,
        duration: 1,
        ease: 'power3.out'
    });
  };

  return (
    <div
      ref={container}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 bg-gradient-to-br from-[#020024] via-[#090979] to-[#001D3D] z-50 p-4 md:p-8 overflow-y-auto text-white font-sans"
      style={{ perspective: '2000px' }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <header className="flex justify-between items-center mb-6 md:mb-12 relative z-10">
        <h2 className="dashboard-title text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-500">
          Dashboard
        </h2>
        <button
          onClick={onCloseAdmin}
          className="close-button group relative px-4 py-2 text-sm font-medium text-cyan-300 bg-black/20 rounded-full border border-cyan-300/30 backdrop-blur-sm transition-all duration-300 hover:border-cyan-300/80 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        >
          <span className="relative z-10">Close</span>
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div className="data-card lg:col-span-3 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 relative overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-gradient-pan"></div>
            <h3 className="text-2xl font-semibold mb-4 text-cyan-200">User Constellation</h3>
            <div className="h-[400px]">
                <ForceDirectedConstellation data={forceData} />
            </div>
        </div>
        
        <div className="data-card lg:col-span-2 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-semibold mb-4 text-fuchsia-300">Question Popularity</h3>
            <StarlightBarChart data={questionPopularity} />
        </div>

        <div className="data-card lg:col-span-5 p-8 flex flex-col md:flex-row items-center justify-center gap-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
             <button 
                onClick={openPairsModalAndGenerate} 
                disabled={isGeneratingPairs}
                className="cta-button relative px-12 py-6 rounded-full text-lg font-bold text-black bg-cyan-300 animate-pulse-glow transition-transform duration-300 ease-out hover:!scale-110 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
             >
                <span className="relative z-10">{isGeneratingPairs ? 'Generating...' : 'Reveal Best Pairs'}</span>
             </button>
        </div>
      </main>

      <BestPairsModal
        isOpen={isPairsModalOpen}
        onClose={onCloseAdmin}
        pairsData={bestPairs}
        isLoading={isGeneratingPairs}
        currentUser={undefined}
      />
    </div>
  )
}