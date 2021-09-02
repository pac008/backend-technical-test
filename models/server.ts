import express, { Application } from 'express';
import cors from 'cors';
import droidRouter from '../routes/droid.routes';

class Server {

  private app: Application
  private port: string;
  private apiPaths = {
    droid: '/api/droid'
  }
  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8888';
    this.middlewares()
    // define routes
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use( cors() );

    // LECTURA DE BODY
    this.app.use( express.json() )
    // CARPETA PÚBLICA 

  }

  routes() {
    this.app.use( this.apiPaths.droid, droidRouter )
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto ' + this.port);
    })
  }
}


export default Server;