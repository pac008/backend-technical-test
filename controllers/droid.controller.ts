import { Request, Response } from "express";
import { Droid, Scan, Coordinates } from '../interfaces/droid.interface';



export const targetCoordinates = async ( req: Request, res: Response ) => {
  
  try {
    let newScan:Scan[] = []
    const coordinates:Coordinates[] = [];
    const body: Droid  = req.body;
    
    if ( !body.protocols ) {
      return res.status(400).json({
        ok: false,
        msg: 'must send a body'
      });
    }
    if ( body.protocols.length == 1) {
      newScan = await  execProtocol( body.protocols[0], body.scan );
    }

    if( body.protocols.length > 1) {
      newScan = await typeOfProtocol(body.protocols, body.scan);
    }
    newScan.forEach( (item: Scan) => {
      const meters = item.coordinates.x + item.coordinates.y;
      if ( meters <= 100 ) {
        coordinates.push( item.coordinates ) 
      }
    });
    
    return res.status(200).json({
      ok: true,
      coordinates
    });
  } catch (error) {
   console.log('err', error); 
  }
} 

const execProtocol = async ( protocol: string, scan: Scan[] ):Promise<Scan[]> => {
  
  try {
    let newScan: Scan[] = scan;

    switch (protocol) {
      case 'avoid-crossfire':
        newScan = scan.filter( item => {
          if ( !item.allies) {
            return item;
          }
        })
        break;
      case 'assist-allies':
        scan.forEach((item: Scan, i: number) => {
          if (item.allies) {
            newScan.splice(i,1)
            newScan.unshift(item)
          }
        })
        break;
      case 'furthest-enemies':
        scan.sort((a: Scan, b: Scan) => (b.coordinates.x + b.coordinates.y) - (a.coordinates.x + a.coordinates.y));
        break;
      case 'closest-enemies':
        scan.sort((a: Scan, b: Scan) => (a.coordinates.x + a.coordinates.y) - (b.coordinates.x + b.coordinates.y));
        break;
      case 'prioritize-mech':
        let i = 0;
        const existMech = scan.find((item: Scan, j: number) => {
          i = j
          return item.enemies.type == 'mech'
        });
        if (existMech) {
          newScan.splice(i,1);
          newScan.unshift(existMech)
        } 
        break;
      case 'avoid-mech':
        newScan = scan.filter( item => {
          if ( item.enemies.type != 'mech') {
            return item;
          }
        })
        break;

    }
    return newScan;

  } catch (error) {
    console.log(error);
    throw new Error("something unexpected happened");

  }
}

const typeOfProtocol = async ( protocols: string[], scan:Scan[] ):Promise<Scan[]> => {
  let newScan: Scan[] = scan;

  protocols.sort(() => -1);
  if ( protocols.includes('prioritize-mech')) {
    protocols.shift();
    protocols.push('prioritize-mech')
  }
  for (let i = 0; i < protocols.length; i++) {
     newScan = await execProtocol( protocols[i], newScan );
  }
  return newScan;
}
