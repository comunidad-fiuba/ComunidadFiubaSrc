import styles from "./Alert.module.css";
import {useEffect, useState} from "react";


export function Alert({tipo, texto, onAlertShow, onAlertClose,setShowAlert}){
    const [divRef, setDivRef] = useState(null)
    const [alertColor, setAlertColor] = useState("red");
    const [innerShow, setInnerShow] = useState(null)
    const [reshow,setReshow] = useState(false);
    const [reset,setReset] = useState(false)
    useEffect(() =>{
        if(reshow && innerShow){
            innerShow()
            setReshow(false)
        }
    },[reshow])

    const closeAlert = () =>{
        divRef.style.display="none";
        if(onAlertClose){
            onAlertClose()
        }
    }

    useEffect(()=>{
        if(tipo ==="buena"){
            setAlertColor("green")
        }else if(tipo ==="mala"){
            setAlertColor("red")
        }else if(tipo ==="intermedia"){
            setAlertColor("rgb(215,173,3)")
        }else if(tipo ==="neutral"){
            setAlertColor("gray")
        }
    },[])

    useEffect(() =>{
        if(setShowAlert && divRef){
            let handler;
            const newHandler = () =>{
                handler = setTimeout(() => {
                    closeAlert()
                }, 3000)
            }
            const showAlert = () => {
                if(divRef.style.display ==="block"){
                    divRef.style.display = "none"
                    setReset(prevstate =>!prevstate)
                    setTimeout(() =>{
                        setReshow(true)
                    },200)
                    return;
                }
                newHandler()
                divRef.style.display="block";
                if(onAlertShow){
                    onAlertShow()
                }
            }
            setShowAlert(e=> {return showAlert})
            setInnerShow(e => {return showAlert})
            return () => {
                if(handler){
                    clearTimeout(handler)
                }
            };
        }
    },[divRef, reset])

    return(
            <div className={styles.alert} style={{backgroundColor:alertColor}} ref={node => setDivRef(node)}>
                <span className={styles.closebtn} onClick={closeAlert}>&times;</span>
                {texto}
                <div className={styles.unloadBar}></div>
            </div>

        )
}