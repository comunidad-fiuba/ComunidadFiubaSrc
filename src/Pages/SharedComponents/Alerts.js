
export function Alerts({children}){
    return(
        <div style={{position: "fixed", top: "0", left:"50%", transform:"translate(-50%,0)", zIndex:"10"}}>
            {children}
        </div>
    )
}