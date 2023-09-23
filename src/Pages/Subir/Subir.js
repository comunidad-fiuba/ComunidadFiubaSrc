import styles from "./Subir.module.css"
import {ACCEPTEDFILES, MATERIAS} from "../../Utilidad/Constantes";
import {httpPostArchive} from "../../Utilidad/HttpClient";
import {useEffect, useState} from "react";
import {Alerts} from "../SharedComponents/Alerts";
import {Alert} from "../SharedComponents/Alert";
import {Link} from "react-router-dom";
import {LoadingBar} from "./Components/LoadingBar";
import { MateriasModal } from "../SharedComponents/MateriasModal/MateriasModal";


export function Subir({auth, user, setArchivosSubidos}){
    document.title = "Comunidad Fiuba - Subir";
    //declarar variables
    const [loading, setLoading] = useState(false)
    const [fileInput, setFileInput] = useState(null)
    const [barWidth, setBarWidth] = useState(0)
    const [timerBar, setTimerBar] = useState(null)
    //alertas
    const [showNiceAlert, setShowNiceAlert] = useState(null)
    const [showBadAlert, setShowBadAlert] = useState(null)
    const [showBadSubjectAlert, setShowBadSubjectAlert] = useState(null)
    //arrastrando archivo sobre la dropbox
    const [arrastrando, setArrastrando] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [materiaElegida, setMateriaElegida] = useState("Materia")
    const randomIntFromInterval = (min, max) =>{ // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    useEffect(() => {
        document.getElementById("materias-btn-subir").value = "Materia"
    },[])
    const startLoading = () =>{
        //desactivar el boton para que el usuario no toque dos veces
        setLoading(true)
        const submit = document.getElementById("submitFile");
        submit.classList.remove(styles.visible)
        submit.classList.add(styles.disabled)
        //timer que aumenta la barra de carga en tiempos y cantidades irregulares
        const setTimer = () =>{
            //guardar el timer en una variable para poder limpiarlo
            const timer = setTimeout(() => {
                setBarWidth(prevState => {
                    //parar antes de llegar a 100
                    if(prevState < 90){
                        setTimer()
                        //limpiar el timer anterior,(no estoy seguro de que sea necesario, pero por las dudas)
                        clearTimeout(timerBar)
                        //aumentar el valor de la barra
                        return prevState + randomIntFromInterval(0,6)
                    }else{
                        //limpiar el timer anterior,(no estoy seguro de que sea necesario, pero por las dudas)
                        clearTimeout(timerBar)
                        return prevState
                    }
                })
                //setear el proximo timer con un tiempo random
            },randomIntFromInterval(2,6)*100)
            setTimerBar(timer)
        }
        setTimer()
    }
    const stopLoading = () =>{
        //detener la carga, primero mostrando el 100
        setBarWidth(100)
        //pequeño delay antes de volver a activar el boton, para tener tiempo de ver el 100
        setTimeout(() =>{
            //reactivar el boton
            setLoading(false)
            const submit = document.getElementById("submitFile");
            submit.classList.remove(styles.disabled)
            submit.classList.add(styles.visible)
            setBarWidth(0)
            clearTimeout(timerBar)
        },200)
    }
    const addFileAndShowSubmit = (file) =>{
        //tamaño del archivo
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        //cosas de interfaz
        let listItem = document.createElement('li');
        listItem.innerHTML = file.name + ' (' + fileSizeMB + ' MB)';
        let fileList = document.getElementById("fileList")
        fileList.appendChild(listItem);
        const submit = document.getElementById("submitFile");
        submit.classList.add(styles.visible);
        let dropArea = document.getElementById("dragArea")
        dropArea.style.display = 'none';
        let form = document.getElementById("formAndList");
        form.style.display = "flex";
    }

    const fileChange = (e) =>{
        let fileList = document.getElementById('fileList');
        // remover elementos existentes en al lista
        fileList.innerHTML = '';
        // agregar el nuevo archivo a la lista
        let file = e.target.files[0];
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        //archivo muy pesado
        if(fileSizeMB > 12){
            alert("Tamaño maximo 12mb, si querés subir un archivo pesado utiliza un compresor (se encuentran en la parte inferior de la pagina) o dividi el pdf")
            e.target.value = null;
            return;
        }
        //chequear que sea del tipo correcto
        if( !file.type || !ACCEPTEDFILES.join(",").includes(file.type)){
            alert("tipo de archivo incorrecto")
            e.target.value = null;
            return
        }
        addFileAndShowSubmit(file)
    };

    const dragoverArea = (e)=>{
        //arrastrando archivo sobre la dropbox
        e.preventDefault(); //preventing from default behaviour
        setArrastrando(true)
    };

    const dragleaveArea = (e)=>{
        //saliendo de la dropbox
        setArrastrando(false)
    };

    const dropOnArea = (e)=>{
        //dropear archivo sobre la dropbox
        e.preventDefault();
        //obtener el archivo dropeado (solo el primero, no se pueden dropear varios)
        let file = e.dataTransfer.files[0];
        let fileList = document.getElementById('fileList');
        // remover elementos existentes en al lista
        fileList.innerHTML = '';
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        //archivo muy pesado
        if(fileSizeMB > 12){
            alert("Tamaño maximo 12mb, si querés subir un archivo pesado utiliza un compresor (se encuentran en la parte inferior de la pagina) o dividi el pdf")
            setArrastrando(false)
            return;
        }
        //chequear que sea del tipo correcto
        if(!file.type || !ACCEPTEDFILES.join(",").includes(file.type)){
            alert("tipo de archivo incorrecto")
            setArrastrando(false)
            return
        }
        //esto es raro, no se por que pero esto funciona
        let archivoCargado = document.getElementById('archivoCargado');
        //no asutarse si el usuario dropea mas de un archivo, solo se usa el primero
        archivoCargado.files = e.dataTransfer.files;

        addFileAndShowSubmit(file);
    };

    const submitNew = (e) => {
        e.preventDefault();
        const form = e.target
        //chequear que la materia este incluida en las nuestras
        if(!MATERIAS.includes(form.children[2].value)){
            showBadSubjectAlert()
            return
        }
        //desactivar el boton para que el usuario no toque dos veces
        startLoading()
        //callback de la request para subir el archivo a drive (no es lo mismo que subir la info a la base de datos)
        const  callback = (result, e) =>{
            if(result === "succes"){
                //archivo subido a drive
                showNiceAlert()
                //crear un objecto de informacion de archivo
                const file = form.file.files[0];
                let fileUrl = e.fileUrl
                if(fileUrl.includes("view?usp=drivesdk")){
                    fileUrl = fileUrl.replace("view?usp=drivesdk","preview")
                }
                let newFileObject = {
                    materia:form.materias.value,
                    tipo:form.elements["tipo"].value,
                    titulo:form.filename.value || file.name,
                    uid:user.uid,
                    token:user.token,
                    url:fileUrl,
                    usuario:user.name,
                    year:Number(form.elements["anio"].value),
                }
                //subir la info del archivo a la base de datos
                fetch(process.env.REACT_APP_POST,{
                    method:"POST",
                    body:JSON.stringify(newFileObject)
                }).then(result=>result.json().then(resJson=>{
                    if(!resJson.error){
                        //no hay error captado en el servidor de la api
                        setArchivosSubidos(prevstate =>{
                            prevstate.push(resJson)
                            return prevstate
                        })
                    }else{
                        //error captado en el servidor de la api
                        alert(resJson.error)
                    }
                })
                    //error no captado en el servidor de la api
                ).catch(e =>alert(e))
            }else{
                //no se pudo subir el archivo a drive
                showBadAlert()
                console.log(result)
            }
            //reactivar el boton
            stopLoading()
            //resetear valores
            let archivoCargado = document.getElementById('archivoCargado');
            archivoCargado.value = null
            let fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
        }
        //subir el archivo, lo anterior era el callback de esto
        httpPostArchive(form, callback,auth, user.name)
    };

    const onclickButton = ()=>{
        fileInput.click();
    }

    const changeMateriaElegida = (e) =>{
        const materia = e.target.value
        document.getElementById("materias-btn-subir").value = materia
        setIsOpen(false)
    }

    const closeMateriaOnClick = () =>{
        document.getElementById("materias-btn-subir").value = "Materia"
        setMateriaElegida("Materia")
    }

    const openMateriasModal = () =>{
        setIsOpen(true)
        document.documentElement.style.overflow = "hidden"
    }


    return(
        <div className={styles.mainDiv}>
            <Alerts>
                <Alert tipo="buena" texto="Contenido subido correctamente." setShowAlert={setShowNiceAlert}/>
                <Alert tipo="mala" texto="Error al subir el archivo" setShowAlert={setShowBadAlert}/>
                <Alert tipo="mala" texto="Selecciona una materia de la lista" setShowAlert={setShowBadSubjectAlert}/>
            </Alerts>
            <MateriasModal isOpen={isOpen} setIsOpen={setIsOpen} materiaElegida={materiaElegida} changeMateriaElegida={changeMateriaElegida} closeMateriaOnClick={closeMateriaOnClick}/>
            {!arrastrando
                ?<div className={styles.dragArea} id ="dragArea" onDragOver={dragoverArea}
                      onDragLeave={dragleaveArea} onDrop={dropOnArea}>
                    <div className={styles.icon}>
                        <ion-icon name="cloud-upload" style={{UserSelect:"none"}}></ion-icon>
                    </div>
                    <header style={{pointerEvents:"none"}}>Arrastra y suelta para subir un archivo</header>
                    <p style={{pointerEvents:"none"}}>O</p>
                    <button id="buscarArchivo" onClick={onclickButton}>Buscar Contenido</button>
                    <p style={{margin:"0", fontSize:"1rem",marginBottom:"10px"}}>Pdf o imagen</p>
                    <div className={styles.linkContainer}>

                        <div className={styles.compresorContainer}>
                            <p style={{margin:"0", fontSize:"1rem", textAlign:"center",padding:"0.2em 0", width:"100%"}}>Convertir</p>
                            <a style={{flexGrow:"1"}} href={"https://www.ilovepdf.com/es/jpg_a_pdf"} target="_blank" className={styles.conversor}>Img a Pdf</a>
                            <a style={{flexGrow:"1"}} href={"https://www.ilovepdf.com/es/dividir_pdf"} target="_blank" className={styles.conversor}>Dividir Pdf</a>
                        </div>
                        <div className={styles.compresorContainer}>
                            <p style={{margin:"0", fontSize:"1rem", textAlign:"center",padding:"0.2em 0", width:"100%"}}>Comprimir</p>
                            <a style={{flexGrow:"1"}} href={"https://www.ilovepdf.com/es/comprimir_pdf"} target="_blank" className={styles.conversor}>Pdf</a>
                            <a style={{flexGrow:"1"}} href={"https://www.iloveimg.com/es/comprimir-imagen"} target="_blank" className={styles.conversor}>Img</a>
                        </div>
                    </div>
                </div>
                :<div className={styles.dragArea} id ="dragArea" onDragOver={dragoverArea}
                      onDragLeave={dragleaveArea} onDrop={dropOnArea}>
                    <div className={styles.icon}>
                        <ion-icon name="cloud-upload" style={{UserSelect:"none"}}></ion-icon>
                    </div>
                    <header style={{pointerEvents:"none"}}>Suelta para subir un archivo</header>
                </div>}

        <section className={styles.formAndList} id ="formAndList">
            <p className={styles.titulo}>¡Ya casi está!</p>
            <p className={styles.descripcionTiny}>Rellená bien las categorias para llegar a más personas</p>
            <ul className={styles.listaSinOrden} id="fileList"></ul>
            <form className={styles.form} onSubmit={submitNew} id="formArchivo">
                <input name="file" type="file" style={{color:"white"}} accept={ACCEPTEDFILES.join(", ")}
                       id="archivoCargado" onChange={fileChange} ref={node =>setFileInput(node)} required/>
                <input name="filename" id="filename" type="text" placeholder="Titulo" maxLength={71} required/>
                <input type="button" name="materias" onChange={(e) =>{setMateriaElegida(e.target.value)}} onClick={openMateriasModal} id="materias-btn-subir"/>
                <select style={{width:"100%"}} id="año" name="anio" required>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>

                <select id="tipo" name="tipo" title="tipo" form="formArchivo" required>
                    <option value="Resumen">Resumen</option>
                    <option value="Final">Final</option>
                    <option value="Final Resuelto">Final Resuelto</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Parcial Resuelto">Parcial Resuelto</option>
                    <option value="Ejercicios">Ejercicios</option>
                </select>
                <div>
                    { loading?<p  style={{position:"relative",width:"100%", textAlign:"center",
                        padding:"0",marginTop:"-10px",
                        color:"rgb(169,169,169)"}}>{barWidth}%</p>:""}
                    <button type="submit" disabled={loading} id="submitFile" className={styles.submit}>{loading?<LoadingBar width={barWidth}/>:"Subir"}</button>
                </div>
            </form>
        </section>
            <Link to="/"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
        </div>
    )
}