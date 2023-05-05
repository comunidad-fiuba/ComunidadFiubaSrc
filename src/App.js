import firebase from 'firebase/compat/app';
import {FIREBASECONFIG} from "./Utilidad/Constantes";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Main from "./Main";
import {useAuthState} from "react-firebase-hooks/auth";
import {Login} from "./Pages/Login";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
firebase.initializeApp(FIREBASECONFIG)

export default function App(){
    const auth = firebase.auth()
    const firestore = firebase.firestore()
    const [user] = useAuthState(auth)
    if(!user && !sessionStorage.refresh){
        sessionStorage.refresh = window.location.href
    }else if(user){
        const refresh =  sessionStorage.refresh
        delete sessionStorage.refresh;
        window.history.replaceState(null, null, refresh)
    }
    if(user){
        return(
            <Main firestore={firestore} auth={auth}/>
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