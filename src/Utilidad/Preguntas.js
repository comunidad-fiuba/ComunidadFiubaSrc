import { InlineMath, BlockMath } from 'react-katex';
import {Pregunta} from "../Components/Pregunta";

const errorFunc = (error) =>{
    return <b style={{color:"red"}}>Fail: {error.name}</b>
}

export const  PREGUNTAS_ANALISIS_2=
    [
        <Pregunta enunciado={
            <>
                <p>Sea</p>
                <BlockMath renderError={errorFunc}>{"\\vec{f}(x ,y) = (\\sqrt{8x - 4x^2+4y-y^2-4}, ln(y-x-1))"}</BlockMath>
                <p>y sea <InlineMath renderError={errorFunc}>{"D \\subset \\R^2"}</InlineMath>el dominio natural de <InlineMath>{"\\vec{f}"}</InlineMath>. Grafique <InlineMath>{"D"}</InlineMath>, su interior y su frontera. Indique si <InlineMath>{"D"}</InlineMath> es compacto y describa mediante ecuaciones/inecuaciones el interior de <InlineMath>{"D"}</InlineMath></p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <BlockMath renderError={errorFunc}>{"int(D): (x-1)^2 + \\frac{(y-2)^2}{4} < 1  \\land y > x+1 "}</BlockMath>
            </>
        }
        verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/P1_221022_resuelto.pdf"}
        ejercicioNumero={1}/>,
        <Pregunta enunciado={
            <>
                <p>Sea</p>
                <BlockMath renderError={errorFunc}>{"\\vec{f}(x ,y) = \\frac{x^2}{2} + xy + y^2 + \\frac{y^3}{3}"}</BlockMath>
                <p>Halle los puntos <InlineMath renderError={errorFunc}>{"(x_0, y_0)"}</InlineMath>para los cuales el plano tangente al gráfico de <InlineMath>{"\\vec{f}"}</InlineMath> en <InlineMath>{"(x_0, y_0, \\vec{f}(x_0, y_0))"}</InlineMath>es paralelo al plano xy y determine, en cada uno de ellos, si se produce un extremo relativo.
                    Indique tipo y valor del extremo en caso afirmativo.</p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <BlockMath renderError={errorFunc}>{"P_1=(0,0) \\land P_2 = (1, -1)"}</BlockMath>
                <BlockMath renderError={errorFunc}>{"P_1\\;minimo\\; relativo\\; y\\; \\vec{f}(P_1)=0 "}</BlockMath>
                <BlockMath renderError={errorFunc}>{"P_2\\; No\\; hay\\; extremo\\; relativo"}</BlockMath>
            </>
        }
                  verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/P1_221022_resuelto.pdf"}
                  ejercicioNumero={2}/>,
        <Pregunta enunciado={
            <>
                <p>Sea <InlineMath renderError={errorFunc}>{"\\Sigma \\subset \\Reals^3"}</InlineMath> la superficie descripta por la ecuación vectorial</p>
                <BlockMath renderError={errorFunc}>{"\\vec{X}=(u+v ,v,uv), \\; (u,v)\\; \\epsilon\\; \\Reals^2"}</BlockMath>
                <p>Encuentre todos los <InlineMath renderError={errorFunc}>{"P \\;\\epsilon \\;\\Sigma"}</InlineMath> para los cuales el plano tangente a <InlineMath renderError={errorFunc}>{"\\Sigma \\; en\\; P"}</InlineMath> resulta ortogonal a la recta
                    normal a la superficie de nivel 6 de <InlineMath renderError={errorFunc}>{"f(x,y,z) = x^2 + 4y + z^2"}</InlineMath> en el punto
                    <InlineMath renderError={errorFunc}>{"\\;(x_0,1,1), \\; x_0<0"}</InlineMath> Para los puntos P hallados, dé una ecuación cartesiana del plano tangente correpondiente.</p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <BlockMath renderError={errorFunc}>{"P=\\vec{\\phi}(-1,1)=(0,1,-1)"}</BlockMath>
                <BlockMath renderError={errorFunc}>{"-2x + 4y + 2z = 2"}</BlockMath>
            </>
        }
                  verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/P1_221022_resuelto.pdf"}
                  ejercicioNumero={3}/>,
        <Pregunta enunciado={
            <>
                <p>Justifique, mediante el teorema de la función implícita, que existe <InlineMath renderError={errorFunc}>{"z_0\\; \\epsilon\\; \\Reals"}</InlineMath> tal que
                    en un entorno del punto <InlineMath renderError={errorFunc}>{"(x_0, y_0) = (0, −1)"}</InlineMath> la ecuación</p>
                <BlockMath renderError={errorFunc}>{"e^x z + y z^2 + z^3 = 1"}</BlockMath>
                <p>define una función <InlineMath renderError={errorFunc}>{"z = h(x,y)"}</InlineMath> de la clase <InlineMath renderError={errorFunc}>{"C^1"}</InlineMath> que
                    cumple <InlineMath renderError={errorFunc}>{"h(0, -1) = z_0"}</InlineMath>.<br/>
                    Calcule mediante una aproximación lineal el valor de <InlineMath renderError={errorFunc}>{"h(0.1, −1.05)"}</InlineMath>  y halle el versor que hace
                    máxima la derivada direccional de h en el punto  (0, −1)</p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <BlockMath renderError={errorFunc}>{"z_0 = 1"}</BlockMath>
                <BlockMath renderError={errorFunc}>{"h(0.1, −1.05)\\approx 0.975"}</BlockMath>
                <BlockMath renderError={errorFunc}>{"\\check{v}=\\frac{\\nabla h(0,-1)}{\\lVert\\nabla h(0,-1)\\rVert}=(\\frac{-1}{\\sqrt{2}}, \\frac{-1}{\\sqrt{2}})"}</BlockMath>
            </>
        }
                  verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/P1_221022_resuelto.pdf"}
                  ejercicioNumero={4}/>,
        <Pregunta enunciado={
            <>
                <p>Sea <InlineMath renderError={errorFunc}>{"f:\\Reals^2\\rarr\\Reals"}</InlineMath> el campo escalar</p>
                <BlockMath renderError={errorFunc}>{"f(x,y) = \\begin{cases}\\begin{matrix} " +
                    "\\frac{\\sin(x^3)-y^3}{x^2+2y^2}\\enspace&(x,y)\\not =(0,0)\\\\ " +
                    "0\\enspace&(x,y) = (0,0)\\end{matrix}\\end{cases}"}</BlockMath>
                <p>Pruebe que <InlineMath renderError={errorFunc}>{"f"}</InlineMath> admite en el origen derivadas direccionales en todas las
                    direcciones. Calcule <InlineMath renderError={errorFunc}>{"f'_x(0,0),\\;f'_y(0,0)"}</InlineMath> y halle los
                    versores <InlineMath renderError={errorFunc}>{"\\check{v}"}</InlineMath> para los
                    cuales <InlineMath renderError={errorFunc}>{"f'((0,0),\\check{v}) = 0"}</InlineMath>.</p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <BlockMath renderError={errorFunc}>{"f'_x(0,0)=f'((0,0),(1,0))=1 \\land f'_y(0,0) = f'((0,0),(0,1))=-\\frac{1}{2}"}</BlockMath>
                <p>hay dos versores para los cuales se anula la derivada direccional y estos son</p>
                <BlockMath renderError={errorFunc}>{"\\check{v}_1=(\\frac{1}{\\sqrt{2}},\\frac{1}{\\sqrt{2}}) \\enspace\\land\\enspace \\check{v}_2=(\\frac{-1}{\\sqrt{2}},\\frac{-1}{\\sqrt{2}}) "}</BlockMath>
            </>
        }
                  verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/P1_221022_resuelto.pdf"}
                  ejercicioNumero={5}/>,
        <Pregunta enunciado={
            <>
                <p>Sea</p>
                <BlockMath renderError={errorFunc}>{"f(x,y)=\\frac{\\sqrt{4-x^2-4y^2}}{x^2-y^2}"}</BlockMath>
                <p>y sea <InlineMath renderError={errorFunc}>{"D"}</InlineMath> el dominio natural de <InlineMath renderError={errorFunc}>{"f"}</InlineMath>.
                    Grafique <InlineMath renderError={errorFunc}>{"D,\\delta D"}</InlineMath> y el interior de <InlineMath renderError={errorFunc}>{"D"}</InlineMath></p>
            </>
        }  solucion={
            <>
                <p>Solucion:</p>
                <p>Ver gráfico en la referencia</p>
            </>
        }
                  verMas={"https://campusgrado.fi.uba.ar/pluginfile.php/2216/mod_page/content/42/R1_11062022_resuelto.pdf"}
                  ejercicioNumero={1}/>





    ]