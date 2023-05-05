import './App.css';
import {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate,
} from "react-router-dom";
import {Subir} from "./Pages/Subir";
import {Home} from "./Pages/Home";
import {Perfil} from "./Pages/Perfil";
import {CambiarUsername} from "./Pages/CambiarUsername";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {STORAGE} from "./Utilidad/Storage";
import {DetallesArchivo} from "./Pages/DetallesArchivo";
import {Practicar} from "./Pages/Practicar";
export default function Main({firestore, auth}) {
    const [interacciones, setInteracciones] = useState(new Map())
    const [reloadSubir, setReloadSubir] = useState(false);
    const archivosRef = firestore.collection('Archivos')
    const [archivosSubidos, setArchivosSubidos] = useState([])
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const userRef = firestore.collection('Usuarios').doc(auth.currentUser.uid)
    const [postsLikes, setPostsLikes] = useState([])
    const likesQuery = auth.currentUser
        ?firestore.collection('Usuarios').doc(auth.currentUser.uid):null
    useEffect(() =>{
        if(likesQuery){
            likesQuery.get().then(doc => {
                const likesData = doc.data()
                if(likesData){
                    setPostsLikes(likesData.postsLikeados)
                }else{
                    const newData ={
                        postsLikeados:[],
                        userName:auth.currentUser.displayName,
                        cambios:3
                    }
                    likesQuery.set(newData)
                    setPostsLikes([])
                }
            })
        }
    },[])
    useEffect(() =>{
        STORAGE.remove("userId")
        STORAGE.remove("likes")
        STORAGE.remove("login")
        STORAGE.remove("userName")

        archivosRef.get().then(result => {
            const getArchivosData = async() =>{
                return await Promise.all(result.docs.map(async(doc) => {
                    const postData = doc.data()
                    postData.comentariosRef = archivosRef.doc(doc.id).collection("comentarios")
                    const postComments = await postData.comentariosRef.get()
                    postData.comentarios = (await Promise.all(postComments.docs.map(async (commentDoc) =>
                    {const thisData = commentDoc.data()
                    thisData.docId=commentDoc.id
                    return thisData}))).sort((a,b) => a.fecha.seconds-b.fecha.seconds)

                    return postData
                }))
            }
            getArchivosData().then(result =>
            {setArchivosSubidos(result)
                setIsLoading(false)})
            })

        userRef.get().then(doc => {
                if (!doc.data()) {
                    const newUserData = {
                        postsLikeados: [],
                        userName: auth.currentUser.displayName,
                        cambios: 3
                    }
                    userRef.set(newUserData)
                    setUserData(newUserData)
                }else{
                    setUserData(doc.data())
                }
            }
        )
    },[])
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/subir" element={<Subir setReloadSubir={setReloadSubir} userData={userData} setArchivosSubidos={setArchivosSubidos}
                                                         reload={reloadSubir} auth={auth} archivosRef={archivosRef}/>}/>
                    <Route path="/perfil" element={<Perfil archivosSubidos={archivosSubidos} setArchivosSubidos={setArchivosSubidos} auth={auth} myUsername={userData?userData.userName:""}
                                                           isLoading={isLoading} archivosRef={archivosRef}/>}/>
                    <Route path="/changeUser" element={<CambiarUsername archivosRef={archivosRef} userRef={userRef}
                                                                        userData={userData} auth={auth}/>}/>
                    <Route exact path="/post/:postIdParam" element={<DetallesArchivo archivosSubidos={archivosSubidos} archivosRef={archivosRef} postsLikes={postsLikes}
                                                                                likesQuery={likesQuery} userName={userData.userName} uid={auth.currentUser.uid}/>}/>
                    <Route path="/practicar" element={<Practicar/>} />

                    <Route path="/" element={<Home archivosSubidos={archivosSubidos} isLoading={isLoading}  postsLikes={postsLikes} likesQuery={likesQuery}
                                                   auth={auth} firestore={firestore} archivosRef={archivosRef} userData={userData}
                                                   setInteracciones={setInteracciones} interacciones={interacciones}/>}/>
                    <Route path="*" element={<Navigate replace to="/" />}/>
                </Routes>
            </main>
        </Router>
    );
}