import {APPURL} from "./Constantes";



export const httpPostArchive = (form, callback, auth, userData) =>{
    const file = form.file.files[0];
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = f => {
        const hijos = form.children;
        const url = APPURL;
        const qs = new URLSearchParams({filename: form.filename.value || file.name, tipo:hijos[5].value,
            materia: hijos[2].value, anio:hijos[4].children[0].value, cuatri:"",
            mimeType: file.type, mail:auth.currentUser.email, userName:userData.userName});
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
            .then(res => res.json())
            .then(e => {
                if(e){
                    callback("succes", e)
                }else{
                    callback("error")
                }
        })
            .catch(err => callback(err));
    }
}

export const httpPostDelete = (fileRow,fileUrl,fileName, callback) =>{
    const url = APPURL;  // <--- Please set the URL of Web Apps.
    const qs = new URLSearchParams({fileRow:fileRow, fileUrl:fileUrl,fileName:fileName});
    fetch(`${url}?${qs}`, {method: "POST", mode:"no-cors"})
        .then(res => {
            if(res.status === 200 || res.status === 0){
                callback("succes")
            }else{
                callback("ResponseError")
            }
        })
        .catch(error => {
            callback(error)
        });
}