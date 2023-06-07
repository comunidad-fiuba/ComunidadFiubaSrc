import firebase from 'firebase/compat/app';
import {FIREBASECONFIG} from "./Utilidad/Constantes";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Main from "./Main";
import {useAuthState} from "react-firebase-hooks/auth";
import {Login} from "./Pages/Login";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Pusher from 'pusher-js';
import {useEffect, useState} from "react";
import {LoadingPage} from "./Pages/LoadingPage";
firebase.initializeApp(FIREBASECONFIG)



export default function App(){
    //inicializar autenticacion y usuario
    const auth = firebase.auth()
    const [user,loading,error] = useAuthState(auth)
    const [waiting, setWaiting] = useState(true)
    //WEBSOCKETS CODIGO DE PRUEBA
    useEffect(() =>{
        //crear pusher
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
            encrypted: true,
        });
        //configurar canal de escucha
        const channel = pusher.subscribe('prueba');
        channel.bind('App\\Events\\PruebaNotification', data => {
            alert(data.message)
        });
        setTimeout(() => setWaiting(false), 1000);
    },[])

    //redireccion desde 404.html, permite que la pagina funcione en github
    if(user && user.email.includes("@fi.uba.ar") && sessionStorage.redirect){
        //tomar el valor guardado previamente en 404
        let redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect !== window.location.href) {
            window.history.replaceState(null, null, redirect);
        }
    }
    //guardar la url actual hasta poder entrar a la pagina principal
    if(!user && !sessionStorage.refresh && window.location.pathname!=='/' ){
        //guardar en sessionStorage
        sessionStorage.refresh = window.location.href
    }else if(user && user.email.includes("@fi.uba.ar") && sessionStorage.refresh){
        //utilizar la url guardada una vez que se entra con un mail adecuado
        const refresh =  sessionStorage.refresh
        delete sessionStorage.refresh;
        window.history.replaceState(null, null, refresh)
    }
    //desconectar usuario invalido en caso de que haya pasado el login de alguna manera (puede pasar)
    if(user && !user.email.includes("@fi.uba.ar")){
        auth.signOut();
    }

    //Los componentes estan separados en Main y Login, login para loggear si no hay user y Main es el resto
    if(loading || waiting){
        return <LoadingPage/>
    }
    if(user){
        return(
            <Main auth={auth}/>
        )
    }else{
        return(
            <Router>
                <main>
                    <Routes>
                        <Route path="/" element={<Login auth={auth}/>}/>
                        <Route path="*" element={<Navigate replace to="/" />}/>
                    </Routes>
                </main>
            </Router>
        )
    }
}