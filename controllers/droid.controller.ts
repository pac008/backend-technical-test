import { Request, Response } from "express";
import { Droid, Scan, Coordinates } from '../interfaces/droid.interface';



export const targetCoordinates = ( req: Request, res: Response ) => {
  
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
      newScan = protocol( body.protocols[0], body.scan );
    }

    if( body.protocols.length > 1) {
      newScan = typeOfProtocol(body.protocols, body.scan);
    }
    newScan.forEach( (item: Scan ) => coordinates.push( item.coordinates ) );
    
    return res.status(200).json({
      ok: true,
      coordinates
    });
  } catch (error) {
   console.log('err', error); 
  }
} 

const protocol = ( protocol: string, scan: Scan[]):Scan[] => {
  
  const newScan:Scan[]  = [];
  switch (protocol) {
    case 'avoid-crossfire':
      scan.forEach( (item: Scan) => {
        if ( !item.allies ) {
        newScan.push( item )
        }
      })
    break;
    case 'assist-allies':
      scan.forEach( (item: Scan) => {
        if ( item.allies ) {
        newScan.push( item )
        }
      })
    break;
    case 'furthest-enemies':
      scan.sort( (a, b) => (b.coordinates.x + b.coordinates.y ) - ( a.coordinates.x + a.coordinates.y ) );
      scan.forEach( (item: Scan) =>  newScan.push( item ) );
    break;  
    case 'closest-enemies':
      scan.sort( (a:Scan, b:Scan) => ( a.coordinates.x + a.coordinates.y ) - (b.coordinates.x + b.coordinates.y ) );
      scan.forEach( (item: Scan) => newScan.push( item ) )
    break;
    case 'prioritize-mech':
      const existMech = scan.find( (item: Scan) => item.enemies.type == 'mech');
      if ( existMech ) {
        newScan.push( existMech )
      } else {
        newScan.push( scan[0] );
      }
    break;
    case 'avoid-mech':
      scan.forEach( (item: Scan) => {
        if ( item.enemies.type != 'mech' ) {
          newScan.push( item )
        }
      })
    break;
  }
      return newScan;
}

const typeOfProtocol = ( protocols: string[], scan:Scan[] ): Scan[] => {
  let newScan: Scan[] = scan;

  for (let i = 0; i < protocols.length; i++ ) {
    newScan = protocol( protocols[i], newScan );
  }
  return newScan;
}
