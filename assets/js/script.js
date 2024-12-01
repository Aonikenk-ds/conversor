const monedaUno = document.getElementById('moneda-uno');
const cantidadUno = document.getElementById('cantidad-uno');
const monedaDos = document.getElementById('moneda-dos');
const cantidadDos = document.getElementById('cantidad-dos');
const cambioEl = document.getElementById('cambio');
const btnTaza = document.getElementById('taza');

async function obtenerTasa(moneda) {
    try {
        if (moneda === 'clp') return 1;

        const res = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await res.json();

        if (!data || !data.serie || data.serie.length === 0) {
            throw new Error(`Datos no disponibles para la moneda: ${moneda}`);
        }

        return data.serie[0].valor;
    } catch (error) {
        console.error(`Error al obtener la tasa de cambio para ${moneda}:`, error);
        return null;
    }
}

async function actualizarValores(origen) {
    const moneda1 = monedaUno.value;
    const moneda2 = monedaDos.value;

    const tasaMoneda1 = await obtenerTasa(moneda1);
    const tasaMoneda2 = await obtenerTasa(moneda2);

    if (!tasaMoneda1 || !tasaMoneda2) {
        cambioEl.innerText = 'Error al obtener las tasas de cambio.';
        return;
    }

    const tipoDeCambio = tasaMoneda1 / tasaMoneda2;

    cambioEl.innerText = `1 ${moneda1.toUpperCase()} = ${tipoDeCambio.toFixed(6)} ${moneda2.toUpperCase()}`;

    if (origen === 'cantidad-uno') {
        cantidadDos.value = (cantidadUno.value * tipoDeCambio).toFixed(2);
    } else if (origen === 'cantidad-dos') {
        cantidadUno.value = (cantidadDos.value / tipoDeCambio).toFixed(2);
    }
}

function intercambiarMonedas() {
    const temp = monedaUno.value;
    monedaUno.value = monedaDos.value;
    monedaDos.value = temp;
    actualizarValores('cantidad-uno');
}

monedaUno.addEventListener('change', () => actualizarValores('cantidad-uno'));
monedaDos.addEventListener('change', () => actualizarValores('cantidad-uno'));
cantidadUno.addEventListener('input', () => actualizarValores('cantidad-uno'));
cantidadDos.addEventListener('input', () => actualizarValores('cantidad-dos'));

btnTaza.addEventListener('click', intercambiarMonedas);

actualizarValores('cantidad-uno');