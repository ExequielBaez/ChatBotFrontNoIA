const axios = require('axios')

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

const urlBaseTurnos = "http://localhost:9698/v1/api/appointment";

const flowTurnos = addKeyword('turnos')
.addAnswer('Consultando turnos disponibles!',null ,

    async (ctx, {flowDynamic}) => {
        let contador = 1
        const response = await axios(urlBaseTurnos)

        for(const item of response.data){
            if(contador>4) break;
            contador++
        await flowDynamic(item.appointmentDay + " / " + item.appointmentTime)
        
        }
    })
   .addAnswer('Selecciona un turno escribiendo su codigo')    

const flowPrincipal = addKeyword(['hola'])
    .addAnswer('🙌 Hola bienvenido escribe turnos para ver disponibilidad')
    
const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowTurnos])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
