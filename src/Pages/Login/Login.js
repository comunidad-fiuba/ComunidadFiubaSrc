import {useEffect, useRef, useState} from "react";
import firebase from 'firebase/compat/app';
import {FcGoogle} from "react-icons/fc";
import styles from "./Login.module.css";
import {BsChevronDown, BsChevronLeft, BsChevronRight} from "react-icons/bs";
import {FRASES_1, FRASES_2} from "../../Utilidad/Constantes";
import {useNavigate} from "react-router-dom";

export function LoginNuevo({auth}){
    const navigate = useNavigate();
    const flechaDer = useRef()
    const flechaIzq = useRef();
    const botonLogIn = useRef()
    const frase2 = FRASES_2[Math.floor(Math.random() * FRASES_2.length)] || "Solo faltabas vos";
    const frase1 = FRASES_1[Math.floor(Math.random() * FRASES_1.length)] || "¡Bienvenido!"
    document.title = "Comunidad Fiuba - Login";
    useEffect(() =>{
        //esto esta en el useEffect porque auth.signout() provoca que la pagina recarge y asi no se pierde...
        //...el mensaje en la recarga
        if(sessionStorage.mailError){
            alert("Solo aceptamos correos de @fi.uba.ar")
            delete sessionStorage.mailError;
        }
        if(auth.currentUser){
            navigate("/")
        }
    },[])

    //iniciar sesion en google con firebase
    const signInWithGoogle = () =>{
        /*
        //fix desesperado
        return
         */
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
            }else{
                navigate("/")
            }
        })
    }
    // <p className={styles.texto}>Inicio de sesión <strong>Desactivado</strong> temporalmente<br/> y con esto las funciones de subir, perfil y likear. <br/>Disculpen las molestias.</p>
    const scrollDown = () =>{
        const height= window.screen.height || window.innerHeight|| document.documentElement.clientHeight||
            document.body.clientHeight
        window.scrollTo({top: height, behavior: 'smooth'});
        flechaIzq.current.classList.remove(styles.clickmeLeft)
        flechaDer.current.classList.remove(styles.clickmeRight)

        botonLogIn.current.classList.remove(styles.animated)
        setTimeout(() =>{
            botonLogIn.current.classList.add(styles.animated)
        },100)
        setTimeout(() =>{
            flechaIzq.current.classList.add(styles.clickmeLeft)
            flechaDer.current.classList.add(styles.clickmeRight)
        },100)
    }
    return(
        <div className={styles.mainContainer}>
            <div className={styles.columna}>
                <h1>Comunidad Fiuba</h1>
                <h3>Un lugar, todo el material necesario</h3>
                <h2 onClick={scrollDown} className={styles.subTitulo}>Sumate a compartir</h2>
            </div>
            <div className={styles.columna}>
                <div>
                    <h2 className={styles.tituloLogIn}>{frase1}</h2>
                    <h2>{frase2}</h2>
                </div>
                <div>
                    <p className={styles.texto}>Admitimos emails de dominio <strong>fi.uba.ar</strong><br/>esta comunidad es exclusiva para fiubenses</p>
                    <div className={styles.botonWrap}>
                        <div className={`${styles.flecha} ${styles.disabled}`} ref={flechaDer}>
                            <BsChevronRight size={24}></BsChevronRight>
                        </div>
                        <button onClick={signInWithGoogle} ref={botonLogIn}><FcGoogle size={48}/><p>Iniciar Sesión</p></button>
                        <div className={`${styles.flecha} ${styles.disabled}`} ref={flechaIzq}>
                            <BsChevronLeft size={24} ></BsChevronLeft>
                        </div>
                    </div>


                    </div>
            </div>
            <div className={styles.arrowDownContainer}>
                <div onClick={scrollDown} className={styles.arrowDown}>
                    <BsChevronDown size={70}></BsChevronDown>
                </div>
            </div>
        </div>
    )
}