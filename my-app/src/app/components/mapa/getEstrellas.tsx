import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export function getEstrellas(calificacion: number) {
  const estrellas = [];
  for (let i = 1; i <= 5; i++) {
    if (calificacion >= i) {
      estrellas.push(<FaStar key={i} />);
    } else if (calificacion >= i - 0.5) {
      estrellas.push(<FaStarHalfAlt key={i} />);
    } else {
      estrellas.push(<FaRegStar key={i} />);
    }
  }
  return estrellas;
}
