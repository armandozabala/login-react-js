import React, { useEffect, useState } from 'react';
import {  db } from '../firebase';

import moment from 'moment';
import 'moment/locale/es';

const Firestore = (props) => {

    const [tareas, setTareas] =  useState([]);
    //para el formulario
    const [tarea, setTarea] = useState('');
    //modo edicion una variable o state
    const [modoEdicion, setModoEdicion] = useState(false)
    // state para el id
    const [id, setId] = useState('');
    //state para los botones de paginacion
    const [ultimo, setUltimo ] = useState(null);
    //desactivar el boton
    const [desactivar, setDesactivar] = useState(false);
  
    useEffect(() =>  {

          const obtenerDatos = async () => {
              try{
  
                  setDesactivar(true);

                  const data = await db.collection(props.user.uid)
                  .limit(2)
                  .orderBy('fecha')
                  .get();
                  
                  const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                  
                  setUltimo(data.docs[data.docs.length - 1]);
                  setTareas(arrayData);

                  const query = await db.collection(props.user.uid)
                  .limit(2)
                  .orderBy('fecha')
                  .startAfter(data.docs[data.docs.length - 1])
                  .get();
                  if(query.empty){
                      console.log("no hay mas");
                      setDesactivar(true);
                  }else{
                      setDesactivar(false);
                  }
  
              }
              catch(error){
                console.log(error);
              }
          }
  
          obtenerDatos();
    },[props.user.uid]);

    const siguiente = async () => {
        try
        {
            const data = await db.collection(props.user.uid)
            .limit(2)
            .orderBy('fecha')
            .startAfter(ultimo)
            .get();

            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTareas([
                ...tareas,
                ...arrayData
            ])
            setUltimo(data.docs[data.docs.length - 1]);

            const query = await db.collection(props.user.uid)
            .limit(2)
            .orderBy('fecha')
            .startAfter(data.docs[data.docs.length - 1])
            .get();
            if(query.empty){
                console.log("no hay mas");
                setDesactivar(true);
            }else{
                setDesactivar(false);
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
  
    const agregar = async (e) => {
      e.preventDefault();
      
      if(!tarea.trim()){
         console.log("esta vacio");
         return;
      }
  
      console.log(tarea);
  
      try{
  
          //const db = firebase.firestore();
          const nuevaTarea = {
                nombre: tarea,
                fecha: Date.now()
          }
  
          const data = await db.collection(props.user.uid).add(nuevaTarea);
  
          setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
          ])
  
          setTarea('')
  
  
      }catch(error)
      {
        console.log(error);
      }
      
    }
  
    const eliminar = async(id) => {
  
        try{
          
          //const db = firebase.firestore();
          await db.collection(props.user.uid).doc(id).delete();
  
          //aray filtrado sacando el id que sea igual al enviado
          const arrayFiltrado = tareas.filter( item => item.id != id);
          setTareas(arrayFiltrado);
  
        }catch(error){
          console.log(error);
        }
  
    }
  
    const activarModoEdicion = (item) => {
  
      setModoEdicion(true);
      setTarea(item.nombre);
      setId(item.id);
      
    }
    
    const editar = async (e) => {
      e.preventDefault();
  
      if(!tarea.trim()){
        console.log("esta vacio");
        return;
      }
  
      try
      {
         //const db = firebase.firestore();
          await db.collection(props.user.uid).doc(id).update({
            nombre: tarea
          });
          
          const arrayEditado = tareas.map(item => (
              item.id === id ? { id: item.id, fecha: item.fecha, nombre: tarea } : item
          ));
  
          setTareas(arrayEditado);
          setModoEdicion(false);
          setId('');
          setTarea('')
  
      } 
      catch(error){
         console.log(error);
      }
  
    }
  
  
    return (
      <div className="container mt-3">
       
        <div className="row">
            <div className="col-md-6">
  
              <ul className="list-group">
                 {
                    tareas.map( item => (
                        <li className="list-group-item" key={item.id}> 
                              {item.nombre} - {  moment(item.fecha).format('LLL') }                    
                              <button 
                                 className="btn btn-warning btn-sm float-end mx-2"
                                 onClick={ () => activarModoEdicion(item)}
                                 >
                                Editar
                              </button>
                              <button 
                                 className="btn btn-danger btn-sm float-end"
                                 onClick={ () => eliminar(item.id)}
                                 >
                                Eliminar
                              </button>
                        </li>
                    ))
                 }
              </ul>
              <button className="btn btn-info btn-block mt-2 btn-sm"
                      onClick={()=>siguiente() }
                      disabled = { desactivar }
              >
                   Siguiente
              </button>
            </div>
            <div className="col-md-6">
                <h3> 
                  {
                      modoEdicion ? 'Editar Tarea ' : 'Agregar Tarea'
                  }
                </h3>
                <form onSubmit={ modoEdicion ? editar : agregar }>
                    <input type="text"
                           placeholder="Ingrese Tarea"
                           className="form-control mb-2"
                           value = {tarea}
                           onChange={ e => setTarea(e.target.value) }/>
  
                          <div className="d-grid gap-2">
                            <button className={ modoEdicion ? 'btn btn-warning' : 'btn btn-dark'} type="submit">
                                {
                                  modoEdicion ? 'Editar' : 'Agregar'
                                }
                            </button>  
                          </div>
                      
                </form>
            </div>
        </div>
  
      </div>
    );
  }

export default Firestore
