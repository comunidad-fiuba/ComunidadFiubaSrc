import styles from "./Login.module.css"
import firebase from 'firebase/compat/app';
import {FcGoogle} from "react-icons/fc";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";


export function Login({auth}){
    useEffect(() =>{
        console.log(sessionStorage.mailError)
        if(sessionStorage.mailError){
            alert("Solo aceptamos correos de @fi.uba.ar")
            delete sessionStorage.mailError;
        }
    },[])

    const signInWithGoogle = () =>{
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({
            hd: 'fi.uba.ar',
            prompt: 'select_account'
        });
        auth.signInWithPopup(provider).then(result => {
            if(!result.additionalUserInfo.profile.email.includes("@fi.uba.ar")){
                sessionStorage.mailError = true;
                auth.signOut()
            }
        })
    }

    return(
        <div className={styles.mainDiv}>
            <div className={styles.contenedor}>
                <p className={styles.titulo}>¡Bienvenido!</p>
                <p className={styles.descripcion}>inicia sesión para tener acceso a una gran biblioteca de material didáctico para ayudarte a cursar en la <strong>FIUBA</strong></p>
                <p className={styles.descripcionDos}>Utilizamos el inicio de sesión con google para guardar tus likes y como método de seguridad.<br/>Cualquier usuario que comparta contenido inadecuado será inhabilitado <strong>permanentemente</strong> del sitio web.</p>
                <button onClick={signInWithGoogle} className={styles.submit}><FcGoogle size={48} style={{position:"absolute",float:"left"}}/><p style={{position:"relative",margin:"0px", top:"50%",left:"50%", transform:"translate(-50%,-50%)", fontSize:"1.25rem"}}>Iniciar Sesión</p></button>
            </div>
            <div style={{bottom:"0",display:"flex", width:"100%", flexWrap:"wrap", justifyContent:"center"}}>
                <div style={{width:"50%",minWidth:"fit-content"}}><p className={styles.contacto} >andres.d.melnik@gmail.com</p></div>
                <div style={{width:"50%",minWidth:"fit-content"}}><p className={styles.contacto}>montialen@gmail.com</p></div>
            </div>
        </div>
    )
}