import firebase from 'firebase/compat/app';
import {FIREBASECONFIG} from "./Utilidad/Constantes";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Main from "./Main";
import {useAuthState} from "react-firebase-hooks/auth";
import {LoadingPage} from "./Pages/LoadingPage";
firebase.initializeApp(FIREBASECONFIG)



export default function App(){
    /*fix desesperado
    const auth = {currentUser:null}
    const loading = false;
    //inicializar autenticacion y usuario

     */
    const auth = firebase.auth()
    const [user,loading,error] = useAuthState(auth)
    //redireccion desde 404.html, permite que la pagina funcione en github
    //desconectar usuario invalido en caso de que haya pasado el login de alguna manera (puede pasar)
    if(user && !user.email.includes("@fi.uba.ar")){
        auth.signOut();
    }
    if(loading){
        return <LoadingPage/>
    }
    return(
        <Main auth={auth}/>
    )
}