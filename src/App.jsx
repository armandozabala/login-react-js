import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import {auth} from './firebase';
import Reset from './components/Reset';

function App() {

  const [firebaseuser, setFirebaseUser] = useState(false);

  useEffect(() => {
       auth.onAuthStateChanged(user => {
          if(user){
             setFirebaseUser(user);
          }else{
             setFirebaseUser(null);
          }
       });
  },[]);

  return  firebaseuser !== false ? (
    <Router>
      <div className="container">
           <Navbar firebaseuser = {firebaseuser}/>
           <Switch>
                 <Route path='/login'>
                       <Login/>
                 </Route>
                 <Route path='/admin'>
                      <Admin/>
                 </Route>
                 <Route path='/reset'>
                      <Reset/>
                 </Route>
                 <Route path='/'>
                       Inicio
                 </Route>
           </Switch>
      </div>
    </Router>

  ) 
  : 
  (
     <p>Cargando....</p>   
  );
}

export default App;
