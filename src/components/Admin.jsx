import React, {useEffect, useState} from 'react';
import {auth} from '../firebase';
import { withRouter } from 'react-router-dom';
import  Firestore  from './Firestore';

const Admin = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
         try
         {
              if(auth.currentUser){
                  console.log("Existe un usuario");
                  setUser(auth.currentUser);
              }
              else
              {
                  console.log("No Existe un usuario");
                  props.history.push('/login');
              }
         }
         catch(error)
         {
             console.log(error);
         }
    },[props.history])

    return (
        <div>
            <h2>Ruta Protegida</h2>
            
             { user && ( 
                     <Firestore user={user}/>
                  ) 
             }
            
        </div>
    )
}

export default withRouter(Admin)
