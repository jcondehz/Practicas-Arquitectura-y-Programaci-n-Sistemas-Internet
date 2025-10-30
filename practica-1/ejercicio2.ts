interface Pelicula {
  id: number;
  title: string;
  genre_ids: number[]; // Array de IDs de géneros
}
 
function agruparPeliculasPorGenero(peliculas: Pelicula[]): { [key: number]: string[] } {
  const resultado: {[key:number]:string[]} = {};

  for (const pelicula of peliculas){
    for(const generoId of pelicula.genre_ids){
        if(!resultado[generoId]){
            resultado[generoId] = [];
        }
        resultado[generoId].push(pelicula.title);
    }
  }
  return resultado;
}
 
// Ejemplo de uso (puedes crear un array de películas de prueba):
const peliculasDePrueba = [
    { id: 1, title: "Película A", genre_ids: [28, 35] },
    { id: 2, title: "Película B", genre_ids: [10749] },
    { id: 3, title: "Película C", genre_ids: [28] },
    { id: 4, title: "Pelicula X", genre_ids: [28,35,10749,69]}
];
 
const peliculasAgrupadas = agruparPeliculasPorGenero(peliculasDePrueba);
console.log(peliculasAgrupadas); // Debería imprimir un objeto con los géneros como claves y arrays de títulos como valores