import React from 'react'
import {
    NavLink,
    Link,
    withRouter
  } from "react-router-dom";
  import { auth } from '../firebase';

const Navbar = (props) => {

    const cerrarSesion = () => {
         auth.signOut()
         .then(()=> {
                props.history.push('/login');
         })
    }

    return (
        <div className="navbar navbar-dark bg-dark">
                <Link to="/inicio" className="navbar-brand">
                    Auth 
                </Link>
                <div>
                 <div className="d-flex">
                      <NavLink to="/" exact className="btn btn-dark mr-2">
                            Inicio
                      </NavLink>
                    
                      {
                          props.firebaseuser !== null ? (
                            <NavLink  to="/admin" className="btn btn-dark mr-2">
                             Admin
                           </NavLink>
                          )
                          :
                          null
                      }

                      {
                          props.firebaseuser !== null ? (
                              <button className="btn btn-dark mr-2"
                                      onClick={ ()=> cerrarSesion() }
                              >
                                    Cerrar Sesión
                              </button>
                           )
                           :
                           (
                            <NavLink  to="/login" className="btn btn-dark mr-2">
                               Login
                            </NavLink>
                          )
                      }
               
                 </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar)
