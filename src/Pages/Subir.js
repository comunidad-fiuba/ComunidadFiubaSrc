import styles from "./Subir.module.css"
import {ACCEPTEDFILES, MATERIAS} from "../Utilidad/Constantes";
import {httpPostArchive} from "../Utilidad/HttpClient";
import {useState} from "react";
import {Alerts} from "../Components/Alerts";
import {Alert} from "../Components/Alert";
import {ImSpinner8} from "react-icons/im";
import {Link} from "react-router-dom";
import firebase from 'firebase/compat/app';


export function Subir({archivosRef, auth, userData, setArchivosSubidos}){
    const [loading, setLoading] = useState(false)
    const [fileInput, setFileInput] = useState(null)
    const [showNiceAlert, setShowNiceAlert] = useState(null)
    const [showBadAlert, setShowBadAlert] = useState(null)
    const [showBadSubjectAlert, setShowBadSubjectAlert] = useState(null)
    const [arrastrando, setArrastrando] = useState(false)
    const addFileAndShowSubmit = (file) =>{
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
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
        // Remove any existing items from the list
        fileList.innerHTML = '';
        // Add the new file to the list
        let file = e.target.files[0];
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if(fileSizeMB > 12){
            alert("Tamaño maximo 12mb, si querés subir un archivo mas pesado contactanos")
            e.target.value = null;
            return;
        }
        if( !file.type || !ACCEPTEDFILES.join(",").includes(file.type)){
            alert("tipo de archivo incorrecto")
            e.target.value = null;
            return
        }
        addFileAndShowSubmit(file)
    };

    const dragoverArea = (e)=>{
        e.preventDefault(); //preventing from default behaviour
        setArrastrando(true)
    };

    const dragleaveArea = (e)=>{
        setArrastrando(false)
    };

    const dropOnArea = (e)=>{
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        let fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        let fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if(fileSizeMB > 12){
            alert("Tamaño maximo 12mb, si querés subir un archivo mas pesado contactanos")
            setArrastrando(false)
            return;
        }
        if(!file.type || !ACCEPTEDFILES.join(",").includes(file.type)){
            alert("tipo de archivo incorrecto")
            setArrastrando(false)
            return
        }
        let archivoCargado = document.getElementById('archivoCargado');

        // Remove any existing items from the list

        // Add the new file to the list
        archivoCargado.files = e.dataTransfer.files;

        addFileAndShowSubmit(file);
    };

    const submitNew = (e) => {
        e.preventDefault();
        const form = e.target
        if(!MATERIAS.includes(form.children[2].value)){
            showBadSubjectAlert()
            return
        }
        setLoading(true)
        const submit = document.getElementById("submitFile");
        submit.classList.remove(styles.visible)
        submit.classList.add(styles.disabled)
        const  callback = (result, e) =>{
            if(result === "succes"){
                showNiceAlert()
                const file = form.file.files[0];
                const hijos = form.children;
                let fileUrl = e.fileUrl
                if(fileUrl.includes("view?usp=drivesdk")){
                    fileUrl = fileUrl.replace("view?usp=drivesdk","preview")
                }
                const newFileObject = {
                    fecha:firebase.firestore.FieldValue.serverTimestamp(),
                    likes:0,
                    materia:hijos[2].value,
                    tipo:hijos[5].value,
                    titulo:form.filename.value || file.name,
                    uid:auth.currentUser.uid,
                    url:fileUrl,
                    usuario:userData.userName,
                    year:Number(hijos[4].children[0].value),
                    postId:e.postId,
                    comentarios:[],
                    comentariosRef:null
                }
                archivosRef.add(newFileObject)
                setArchivosSubidos(prevstate =>{
                    prevstate.push(newFileObject)
                    return prevstate
                })
            }else{
                showBadAlert()
                console.log(result)
            }
            setLoading(false)
            submit.classList.remove(styles.disabled)
            submit.classList.add(styles.visible)
            let archivoCargado = document.getElementById('archivoCargado');
            archivoCargado.value = null
            let fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
        }
        httpPostArchive(form, callback,auth, userData)
    };

    const onclickButton = ()=>{
        fileInput.click();
    }

    return(
        <div className={styles.mainDiv}>
            <Alerts>
                <Alert tipo="buena" texto="Contenido subido correctamente." setShowAlert={setShowNiceAlert}/>
                <Alert tipo="mala" texto="Error al subir el archivo" setShowAlert={setShowBadAlert}/>
                <Alert tipo="mala" texto="Selecciona una materia de la lista" setShowAlert={setShowBadSubjectAlert}/>
            </Alerts>
            <Link to="/"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
            {!arrastrando
                ?<div className={styles.dragArea} id ="dragArea" onDragOver={dragoverArea}
                      onDragLeave={dragleaveArea} onDrop={dropOnArea}>
                    <div className={styles.icon}>
                        <ion-icon name="cloud-upload" style={{UserSelect:"none"}}></ion-icon>
                    </div>
                    <header style={{pointerEvents:"none"}}>Arrastra y suelta para subir un archivo</header>
                    <p style={{pointerEvents:"none"}}>O</p>
                    <button id="buscarArchivo" onClick={onclickButton}>Buscar Contenido</button>
                    <p style={{margin:"0", fontSize:"1rem"}}>Pdf o imagen</p>
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
                <input type="text"  name="materias" list="materias" placeholder="Materia" required/>
                <datalist id="materias">
                    {MATERIAS.map(materia =>(<option key={materia} value ={materia}/>))}
                </datalist>
                <div style={{display:"flex", justifyContent:"space-evenly"}}>
                    <select style={{width:"100%"}} id="año" required>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>
                </div>

                <select id="tipo" name="tipo" title="tipo" form="formArchivo" required>
                    <option value="Resumen">Resumen</option>
                    <option value="Final">Final</option>
                    <option value="Final Resuelto">Final Resuelto</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Parcial Resuelto">Parcial Resuelto</option>
                    <option value="Ejercicios">Ejercicios</option>
                </select>

                <button type="submit" disabled={loading} id="submitFile" className={styles.submit}>{loading?<ImSpinner8 className={styles.spinner}/>:"Subir"}</button>
            </form>
        </section>
            <a href={"https://www.ilovepdf.com/es/jpg_a_pdf"} target="_blank" className={styles.conversor}>Imagenes a Pdf</a>
        </div>
    )
}