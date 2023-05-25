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
import {DetallesArchivo} from "./Pages/DetallesArchivo";
import {Practicar} from "./Pages/Practicar";
export default function Main({firestore, auth}) {
    const [interacciones, setInteracciones] = useState(new Map())
    const [reloadSubir, setReloadSubir] = useState(false);
    const [archivosSubidos, setArchivosSubidos] = useState([])
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [postsLikes, setPostsLikes] = useState([])
    const [cuota, setCuota] = useState(false);
    useEffect(() =>{
        const fetchData = async () =>{
            await fetch(process.env.REACT_APP_USER_DATA+auth.currentUser.uid,{
                method:"GET"
            }).then(result=>result.json()
                .then(resJson=>{
                    if(!resJson.error){
                        setUserData(resJson)
                        setPostsLikes(resJson.likes)
                    }else{
                        if(resJson.error==='Usuario no encontrado'){
                            fetch(process.env.REACT_APP_USER,{
                                method:"POST",
                                body:JSON.stringify({
                                    userName:auth.currentUser.displayName,
                                    uid:auth.currentUser.uid
                                })
                            }).then(result=>result.json().then(resJson=>{
                                setUserData(resJson)
                            })).catch(e =>alert(e))
                        }else{
                            alert(resJson.error)
                        }
                    }
                })
                .catch(e =>console.log(e))
            ).catch(e =>console.log(e))

            await fetch(process.env.REACT_APP_POSTS,{
                method:"GET"
            }).then(result=>result.json().then(resJson=>{
                setArchivosSubidos(resJson)
            }).catch(e =>{
                alert(e)
            })).catch(e => {
                alert(e)
            })
        }
        fetchData().then(res =>setIsLoading(false))
    },[])
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/subir" element={<Subir setReloadSubir={setReloadSubir} user={userData} setArchivosSubidos={setArchivosSubidos}
                                                         reload={reloadSubir} auth={auth} />}/>
                    <Route path="/perfil" element={<Perfil archivosSubidos={archivosSubidos} setArchivosSubidos={setArchivosSubidos} auth={auth} userData={userData}
                                                           isLoading={isLoading} />}/>
                    <Route path="/changeUser" element={<CambiarUsername userData={userData} setUserData={setUserData} auth={auth}/>}/>
                    <Route exact path="/post/:postSlug" element={<DetallesArchivo isLoading={isLoading} archivosSubidos={archivosSubidos}  postsLikes={postsLikes}
                                                                                userData={userData} setPostsLikes={setPostsLikes}/>}/>
                    <Route path="/practicar" element={<Practicar/>} />

                    <Route path="/" element={<Home archivosSubidos={archivosSubidos} isLoading={isLoading}  postsLikes={postsLikes}
                                                   auth={auth} firestore={firestore} setPostsLikes={setPostsLikes} userData={userData}
                                                   setInteracciones={setInteracciones} interacciones={interacciones} cuota={cuota}/>}/>
                    <Route path="*" element={<Navigate replace to="/" />}/>
                </Routes>
            </main>
        </Router>
    );
}