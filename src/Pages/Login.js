import styles from "./Login.module.css"
import firebase from 'firebase/compat/app';
import {FcGoogle} from "react-icons/fc";
import {useEffect} from "react";


export function Login({auth}){
    document.title = "Comunidad Fiuba - Login";
    useEffect(() =>{
        //esto esta en el useEffect porque auth.signout() provoca que la pagina recarge y asi no se pierde...
        //...el mensaje en la recarga
        if(sessionStorage.mailError){
            alert("Solo aceptamos correos de @fi.uba.ar")
            delete sessionStorage.mailError;
        }
    },[])

    //iniciar sesion en google con firebase
    const signInWithGoogle = () =>{
        //proveedor de inicio de sesion de google
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({
            hd: 'fi.uba.ar',
            prompt: 'select_account'
        });
        //iniciar sesion con una ventana nueva a modo de popup
        auth.signInWithPopup(provider).then(result => {
            //si el mail ingresado no es de la fiuba se desconecta al usuario
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