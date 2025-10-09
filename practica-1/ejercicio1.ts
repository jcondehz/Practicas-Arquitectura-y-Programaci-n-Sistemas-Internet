function factorialRecursivo(n:number): number {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorialRecursivo(n - 1);
    }
}

const numero = 5;
const resultadoFactorial = factorialRecursivo(numero);
console.log(`El factorial de ${numero} es ${resultadoFactorial}`); //imprimir 120
