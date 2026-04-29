import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

type Person = {
  id: string;
  name: string;
  year?: string;
  gender?: 'male' | 'female';
  children?: Person[];
};

const treeData: Person = {
  id: "ultimate_root",
  name: "Dedabayev Oila Ajdodlari",
  children: [
    {
      id: "dedavoyxoji",
      name: "Mirzaboyev Dedavoyxoji",
      year: "1877-1953",
      gender: "male",
      children: [
        {
          id: "abduvohid",
          name: "Dedabayev Abduvohid",
          year: "1924-2010",
          gender: "male",
          children: [
            {
              id: "malik",
              name: "Dedabayev Malik",
              year: "1959",
              gender: "male",
              children: [
                {
                  id: "faxriddin",
                  name: "Dedabayev Faxriddin",
                  year: "1982",
                  gender: "male",
                  children: [
                    { id: "muhammadyor", name: "Dedabayev Muhammadyor", year: "2005", gender: "male" },
                    { id: "muhammadrosul", name: "Malikov Muhammadrosul", year: "2007", gender: "male" },
                    { id: "fotima", name: "Malikova Fotima", year: "2013", gender: "female" }
                  ]
                },
                {
                  id: "sharobiddin",
                  name: "Dedabayev Sharobiddin",
                  year: "1985",
                  gender: "male",
                  children: [
                    { id: "mubina", name: "Malikova Mubina", year: "2008", gender: "female" },
                    { id: "abubakr", name: "Malikov Abubakr", year: "2013", gender: "male" }
                  ]
                },
                {
                  id: "utkurbek",
                  name: "Dedabayev Utkurbek",
                  year: "1988",
                  gender: "male",
                  children: [
                    { id: "zakariyo", name: "Malikov Zakariyo", year: "2013", gender: "male" },
                    { id: "oyshaxon", name: "Malikova Oyshaxon", year: "2018", gender: "female" }
                  ]
                },
                { id: "abdulaziz", name: "Dedabayev Abdulaziz", year: "1993", gender: "male" },
                { id: "erkinjon", name: "Dedabayev Erkinjon", year: "1995", gender: "male" }
              ]
            },
            { id: "gani", name: "Dedabayev G'ani", year: "1961", gender: "male" },
            { id: "botirjon", name: "Dedabayev Botirjon", year: "1965", gender: "male" },
            { id: "rano", name: "Dedabayeva Ra'no", year: "1968", gender: "female" },
            { id: "husanboy", name: "Dedabayev Husanboy", year: "1971", gender: "male" },
            { id: "asila", name: "Dedabayeva Asila", year: "1975", gender: "female" }
          ]
        },
        { id: "xafisxon", name: "Dedabayev Xafisxon", year: "1929-2000", gender: "male" },
        { id: "bositxon", name: "Dedabayev Bositxon", year: "1938-2023", gender: "male" }
      ]
    }
  ]
};

const TreeNode = ({ 
  id, 
  name, 
  year, 
  type,
  gender
}: { 
  id: string; 
  name: string; 
  year?: string; 
  type: string; 
  gender?: 'male' | 'female';
}) => {
  const getColors = () => {
    if (gender === 'female') return 'bg-pink-100 border-pink-400 text-slate-900';
    if (gender === 'male') return 'bg-blue-100 border-blue-400 text-slate-900';
    return 'bg-slate-100 border-slate-400 text-slate-900'; // Default for the root/ajdodlar
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: id === 'ultimate_root' ? 0.4 : 0.1 }}
      className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg border-2 z-10 w-20 sm:w-24 text-center shadow-lg transition-transform hover:scale-105 ${getColors()}`}
    >
      <div className={`font-semibold ${type === 'root' ? 'text-xs sm:text-sm' : 'text-[8px] sm:text-[9px]'} leading-tight`}>
        {name}
      </div>
      {year && year !== "Ota" && (
        <div className="text-[7.5px] sm:text-[8px] font-mono mt-1 bg-white/70 px-1 py-0.5 rounded-full border border-black/10 shadow-sm leading-none">
          {year}
        </div>
      )}
    </motion.div>
  );
};

const renderTree = (node: Person, level: number = 0) => {
  const typeMap = ['root', 'parent', 'child', 'grandchild', 'greatgrandchild', 'greatgreatgrandchild', 'greatgreatgreatgrandchild'];
  const nodeType = typeMap[level] || 'greatgreatgreatgrandchild';

  return (
    <div key={node.id} className="flex flex-col items-center gap-40 md:gap-64 relative">
      {/* Children Row - Rendered ABOVE the current node in inverted pyramid */}
      {node.children && node.children.length > 0 && (
        <div className="flex flex-row items-end justify-center gap-0.5 sm:gap-1">
          {node.children.map(child => renderTree(child, level + 1))}
        </div>
      )}
      
      <TreeNode 
        id={node.id} 
        name={node.name} 
        year={node.year} 
        type={nodeType} 
        gender={node.gender}
      />
    </div>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ start: {x: number, y: number}, end: {x: number, y: number} }[]>([]);

  useEffect(() => {
    const redrawLines = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines: typeof lines = [];

      const getPos = (id: string, isTop: boolean) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + (isTop ? 0 : rect.height)
        };
      };

      const traverse = (node: Person) => {
        if (node.children) {
          const parentPos = getPos(node.id, true); // true = top center of parent
          if (parentPos) {
            node.children.forEach(c => {
              const childPos = getPos(c.id, false); // false = bottom center of child
              if (childPos) {
                newLines.push({ start: childPos, end: parentPos });
              }
              traverse(c);
            });
          }
        }
      };

      traverse(treeData);
      setLines(newLines);
    };

    redrawLines();
    window.addEventListener('resize', redrawLines);
    
    // Minor delay to ensure everything gets correctly placed first
    const timer1 = setTimeout(redrawLines, 100);
    const timer2 = setTimeout(redrawLines, 600); // 500ms is the duration of Framer Motion animation
    return () => {
      window.removeEventListener('resize', redrawLines);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 overflow-x-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center gap-3 sticky left-0 right-0 w-max"
        >
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <Users size={32} />
          </div>
          <h1 className="text-3xl font-bold text-center tracking-tight text-slate-800">
            Dedabayevlar Oila Shajarasi
          </h1>
          <p className="text-slate-500 font-medium">Teskari Piramida Shakli</p>
        </motion.div>

        {/* Tree Container */}
        <div ref={containerRef} className="relative mt-8 min-w-max flex justify-center pb-20 px-8">
          
          {/* Connecting SVG Lines Overlay */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, i) => {
              // Draw smooth bezier curves
              const midY = (line.start.y + line.end.y) / 2;
              const d = `M ${line.start.x} ${line.start.y} C ${line.start.x} ${midY}, ${line.end.x} ${midY}, ${line.end.x} ${line.end.y}`;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  className="path-anim"
                />
              );
            })}
          </svg>

          {/* Render the generic tree starting from the ultimate root */}
          <div className="relative z-10 w-full flex justify-center">
            {renderTree(treeData, 0)}
          </div>
        </div>
        
      </div>
    </div>
  );
}
