export default function Estrellas({ promedio }: { promedio: number }) {
    const estrellas = [];
  
    for (let i = 1; i <= 5; i++) {
      if (promedio >= i) {
        estrellas.push(<span key={i}>★</span>);
      } else if (promedio >= i - 0.5) {
        estrellas.push(
          <span
            key={i}
            className="relative inline-block w-[1em]"
          >
            <span className="absolute w-[44%] overflow-hidden text-[#fca311]">★</span>
            <span className="text-[#e0e0e0]">★</span>
          </span>
        );
      } else {
        estrellas.push(<span key={i}>☆</span>);
      }
    }
  
    return <div className="text-[#fca311] text-2xl leading-none flex gap-1">{estrellas}</div>;
  }