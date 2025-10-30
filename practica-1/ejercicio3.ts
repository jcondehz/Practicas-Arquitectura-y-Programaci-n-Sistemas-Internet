async function obtenerTitulosDePosts(): Promise<string[]> {
    try{
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts")
    if(!respuesta){
        throw new Error ('Error en la llamada fetch')
    }
    const posts: {title:string}[]= await respuesta.json()
    const titulos = posts.map(post=>post.title)
    return titulos;
    }catch(error){
        console.error("error")
        throw error;
    }
}

async function ejecutarObtenerTitulos() {
  try {
    const titulos = await obtenerTitulosDePosts();
    console.log(`Títulos de los posts (con async/await): ${titulos}`);
  } catch (error) {
    console.error(`Error al obtener los títulos (con async/await): ${error}`);
  }
}

ejecutarObtenerTitulos();

