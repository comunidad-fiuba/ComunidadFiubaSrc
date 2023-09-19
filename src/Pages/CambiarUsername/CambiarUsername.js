import styles from "./CambiarUsername.module.css"
import {useState} from "react";
import {Link} from "react-router-dom";
import {BsPerson} from "react-icons/bs";
import {Alert} from "../SharedComponents/Alert";
import {Alerts} from "../SharedComponents/Alerts";

export function CambiarUsername({userData,setUserData}){
    //declarar variables
    const [isDisabled, setIsDisabled] = useState(false)
    const [showBadAlert, setShowBadAlert] = useState(null)
    const [showNiceAlert, setShowNiceAlert] = useState(null)
    const [showSameNameAlert, setShowSameNameAlert] = useState(null)
    const [showSinCambiosAlert, setShowSinCambiosAlert] = useState(null)

    const changeNombre = (e) =>{
        //cambir nombre de usuarios
        e.preventDefault()
        const newUser = document.getElementById("newUserName").value
        const userVerification = document.getElementById("userNameVerification").value
        //verificar que el usuario tenga cambios disponibles
        if(userData.changes <= 0){
            showSinCambiosAlert()
            return
        }
        //verificar que el nombre nuevo no sea el mismo que ya tiene
        if(newUser === userData.name){
            showSameNameAlert()
            return
        }
        if(newUser === userVerification){
            //fetch a la api para cambiar el nombre
            fetch(process.env.REACT_APP_USERNAME, {
                method:"POST",
                body:JSON.stringify({token:userData.token,uid:userData.uid,newName:newUser})
            }).then(result =>{
                //deberia chequear errores, queda para otro dia
                setIsDisabled(true)
                showNiceAlert()
                //cambiar el boton por el boton de recargar
                const submitButton = document.getElementById("submitPass")
                submitButton.classList.remove(styles.submit)
                submitButton.classList.add(styles.submitDisabled)
                setUserData((prevState) =>{
                    prevState.name = newUser;
                    prevState.changes = prevState.changes-1;
                    return prevState;
                })
            }).catch(error =>alert(error))
        }else{
            showBadAlert()
        }
    }

    return(
        <div className={styles.mainDiv}>
            <Alerts>
                <Alert tipo="mala" texto="Error: Los nombres no coinciden" setShowAlert={setShowBadAlert}/>
                <Alert tipo="intermedia" texto="Ese es tu nombre actual" setShowAlert={setShowSameNameAlert}/>
                <Alert tipo="buena" texto="Nombre cambiado con éxito" setShowAlert={setShowNiceAlert}/>
                <Alert tipo="neutral" texto="No hay mas cambios de nombre"
                       setShowAlert={setShowSinCambiosAlert}/>
            </Alerts>
            <Link to="/perfil"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
            <div className={styles.pagina}>
            <div className={styles.contenedor}>
                <h2>Usuario</h2>
                <form action="" className={styles.form} onSubmit={!isDisabled?changeNombre:() =>window.location.reload()}>
                    <fieldset>
                        <BsPerson className={styles.icono}/>
                        <input type="text" id="newUserName" placeholder="Nuevo Nombre" required minLength={5}/>
                    </fieldset>
                    <fieldset>
                        <BsPerson className={styles.icono}/>
                        <input type="text" id="userNameVerification" placeholder="Confirmar Nombre" required minLength={5}/>
                    </fieldset>
                    {!isDisabled
                        ?<input type="submit" id="submitPass" value="Aplicar Cambios" className={styles.submit}/>
                        :<input type="submit" id="submitPass" value="Recargar" className={styles.submitDisabled}/>
                    }
                    <p style={{color:"white"}}>Cambios disponibles: {userData.changes}</p>
                </form>
            </div>
        </div>
        </div>
    )
}