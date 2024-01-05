
export const CorsConf2 = (req,res) => {
    // ahora sin usar el CORS
    const ACCEPTED_ORIGINS = [
        'http://localhost:5174',
        'http://localhost:5173',
        'http://localhost:3000',
		'https://pepinillojr.github.io'
    ]
    // accedo al origen
    const origen = req.header('origin')
    console.log(origen)
    if (ACCEPTED_ORIGINS.includes(origen)){
        // una vez sabemos que es un origen aceptado
        // devolvemos con el parametro callback
        // primero el error, que aca es null, porque no hay error
        // y como segundo true ---> aceptado
        //                false --> rechazado
        res.header('Access-Control-Allow-Origin', ['*'])
        res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, PATCH');
        res.header("Access-Control-Allow-Headers", 'Content-Type');
    } 
    else if (!origen) {
        // puede suceder que el servidor se llame a si mismo, en ese caso
        // el header no mostrara el origen, por lo que sera undefined
        // en tal caso, lo aceptamos como un descarte
        res.header('Access-Control-Allow-Origin', 'http://localhost:1234')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT')
        res.header("Access-Control-Allow-Headers", 'Content-Type');
    }
}