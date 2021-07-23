import React, { useState, useCallback } from 'react'
import { auth, db } from '../firebase';
import { withRouter } from 'react-router-dom';

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] =useState(null);
    //swith cambiar formulario registro - login
    const [esRegistro, setEsRegistro] = useState(false);



    
    const procesarDatos = (e) => {
        //no haga enviar por get
        e.preventDefault();

        if(!email.trim()){
            console.log("Ingrese email");
            setError("Ingrese email");
            return;
        }

        if(!pass.trim()){
            console.log("Ingrese password");
            setError("Ingrese password");
            return;
        }

        if(pass.length < 6){
             console.log("Password mayor a 6 caracteres");
             setError("Password debe ser mayor a 6 caracteres");
             return;
        }

        setError(null);
        

        if(esRegistro){
           registrar();
        }else{
            login();
        }

    }

    const login = useCallback( async() => {

           try{
                const res = await auth.signInWithEmailAndPassword(email, pass);
                console.log(res.user);



                setEmail('');
                setPass('');
                setError(null);

                props.history.push('/admin');
           }
           catch(error)
           {
               console.log(error);
               if(error.code === "auth/invalid-email"){
                setError("Email es invalido");
               }

               if(error.code === "auth/user-not-found"){
                setError("Email no existe");
               }


               if(error.code === "auth/wrong-password"){
                setError("Contraseña es incorrecta");
               }
           }

    },[email, pass,  props.history])


    //useCallback
    const registrar = useCallback( async () => {
             try
             {
                  const res  = await auth.createUserWithEmailAndPassword(email, pass);
                  console.log(res.user);

                  await db.collection('usuarios').doc(res.user.email).set({
                       email: res.user.email,
                       uid: res.user.uid
                       
                  });

                  setEmail('');
                  setPass('');
                  setError(null);

                  props.history.push('/admin');

             }catch(error)
             {    
                  console.log(error);
                  if(error.code === "auth/invalid-email"){
                    setError("Email no valido");
                  }
                  if(error.code === 'auth/email-already-in-use'){
                    setError("Email ya se encuentra registrado");
                  }
                  
             }

    },[email, pass, props.history]);

    return (
        <div className="mt-5">
           <h3 className="text-center">
               {
                   esRegistro ? 'Registro de Usuarios' : 'Login de Acceso'
               }
           </h3>
           <hr/>
           <div className="row justify-content-center">
               <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                   <form onSubmit={ procesarDatos }>
                       {
                           error && (
                               <div className="alert alert-danger">
                                   {error}
                               </div>
                           )
                       } 
                        <input type="email" 
                               className="form-control mb-2"
                               placeholder="Ingrese su Email"
                               onChange={ e => setEmail(e.target.value)}
                               value={email}
                               />
                        <input type="password" 
                               className="form-control mb-2"
                               placeholder="Ingrese su Password"
                               onChange={ e => setPass(e.target.value)}
                               value={pass}
                               />
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                                { 
                                  esRegistro ? 'Registrarse' : 'Acceder' 
                                }
                        </button>
                        <button className="btn btn-info btn-sm btn-block"
                                onClick={ ()=> setEsRegistro(!esRegistro) }
                                type="button"
                        >
                                { 
                                  esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' 
                                }
                        </button>


                        {
                            !esRegistro ? (
                                <button className="btn btn-danger btn-sm mt-2" 
                                        type="button"
                                        onClick={()=> props.history.push('/reset')}
                                        >
                                   Recuperar Contraseña
                                </button>
                            ): null
                        }

                
                   </form>
               </div>
           </div>
        </div>
    )
}

export default withRouter(Login)
