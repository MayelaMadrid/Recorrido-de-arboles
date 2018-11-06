import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
let actualesNodos;
class App extends Component {
  state = {
    name: "((a*2)-(b+2))/(c/2)",
    inOrden: [],
    preOrden: [],
    posOrden: []

  };

  recorerEnOrden = () => {
    let preorden = [],
      postorden = [],
      inorden = [];

    this.preorden(actualesNodos, preorden);
    this.setState({ preOrden: preorden })

    this.postorden(actualesNodos, postorden);
    this.setState({ posOrden: postorden })

    this.inorden(actualesNodos, inorden);
    this.setState({ inOrden: inorden })


  }

  nuevoArbol = () => {
    let expresion = this.state.name;
    let nodos = this.crear(expresion);
    actualesNodos = nodos[0];

    this.recorerEnOrden();
  }


  Parcer = {

    operadores: {
      '^': 5,
      '*': 4,
      '/': 4,
      '+': 3,
      '-': 3,
      ')': 2,
      '(': 1,
    }
  }
  /**
   *Depura la expresion algebraica, quita espacios en blanco y deja un espacion entre peradores y dijitos
   */
  prepararExpresion = (expresion) => {
    let simbolos = "+-*/()^";
    let salida = "";
    expresion = expresion.replace(/\\s+/, '');
    expresion = "(" + expresion + ")";
    for (let i = 0; i < expresion.length; i++) {
      if (simbolos.indexOf(expresion.charAt(i)) !== -1) {
        salida += " " + expresion.charAt(i) + " ";
      } else {
        salida += expresion.charAt(i);
      }

    }
    return salida.trim();
  };
  /**
   *Determina la jerarquia de operadores
   */
  jerarquia = (operador) => {
    if (this.Parcer.operadores[operador]) {
      return this.Parcer.operadores[operador];
    }
    //si no es un operador tiene mayor precedencia
    return 99;
  };
  aPosFija = (expresion) => {
    expresion = this.prepararExpresion(expresion);
    let infija = expresion.split(" ");

    let E = infija.reverse(), // Entrada
      P = [], // Temporal
      S = []; //salida

    while (E.length > 0) {

      // E[E.length - 1] extrae el ultimo valor de la pilla  .peek();
      switch (this.jerarquia(E[E.length - 1])) {
        case 1:
          P.push(E.pop());
          break;
        case 2:
          while (P[P.length - 1] !== "(") {
            S.push(P.pop())
          }
          P.pop();
          E.pop();
          break;
        case 3:
        case 4:
        case 5:
          while (this.jerarquia(P[P.length - 1]) >= this.jerarquia(E[E.length - 1])) {
            S.push(P.pop());
          }
          P.push(E.pop());
          break;
        default:
          S.push(E.pop());
      }
    }
    //quita las comas y coloca espacio
    return S.join(" ")
      //elimina 2 o mas espacios juntos
      .replace(/\s{2,}/g, ' ').
      //elimina espacios al inicio y final
      trim();
  }

  crear = (expresion) => {
    let postfija = this.aPosFija(expresion);
    console.info("expresion posfija:", posfija);
    let posfija = postfija.split(" ");

    //Declaración de las pilas
    let E = posfija.reverse(); //Pila entrada
    let P = []; //Pila de operandos
    //Algoritmo de Evaluación Postfija
    let operadores = "+-*/%^";
    while (E.length > 0) {
      //si es un operador
      if (operadores.indexOf(E[E.length - 1]) !== -1) {
        P.push(this.crearNodo(E.pop(), P.pop(), P.pop()));

      } else {
        P.push(E.pop());
      }
    }
    //retorna nodos
    return P;
  };


  evaluar = (operador, n2, n1) => {
    if (operador === '^') {
      return Math.pow(n1, n2);
    }
    return eval(n1 + operador + n2);
  }
  getNumber = (v) => {
    if (isNaN(v) || typeof v === 'string') {
      return v.data
    }
    return v;
  };
  getInfo = (v) => {
    //es un digito
    if (!isNaN(v) || typeof v === 'string') {
      return {
        label: v
      }
    }
    //es resultado de una operacion
    return v;
  };
  crearNodo = (operador, n2, n1) => {
    return {
      label: operador,
      expanded: true,
      children: [this.getInfo(n1), this.getInfo(n2),
      ],
      data: this.evaluar(operador, this.getNumber(n2), this.getNumber(n1))
    };
  };

  preorden = (nodo, log) => {
    if (nodo === null)
      return;
    log.push(nodo.label);
    if (!nodo.children)
      return;
    this.preorden(nodo.children[0], log); //recorre subarbol izquierdo
    this.preorden(nodo.children[1], log); //recorre subarbol derecho
  };
  /*     (izquierdo, derecho, raíz). Para recorrer un árbol binario no vacío en postorden, hay que realizar las siguientes operaciones recursivamente en cada nodo:*/
  postorden = (nodo, log) => {
    if (nodo === null)
      return;
    if (nodo.children) {
      this.postorden(nodo.children[0], log);
      this.postorden(nodo.children[1], log);
    }
    log.push(nodo.label);
  }
  /*    Inorden: (izquierdo, raíz, derecho).Para recorrer un árbol binario no vacío en inorden(simétrico), hay que realizar las siguientes operaciones recursivamente en cada nodo:*/
  inorden = (nodo, log) => {

    if (nodo === null)
      return;

    if (nodo.children) {
      this.inorden(nodo.children[0], log);
    }
    log.push(nodo.label);
    if (nodo.children) {
      this.inorden(nodo.children[1], log);
    }



  }

  handleChange = name => event => {

    this.setState({
      [name]: event.target.value,
    });
  };
  render() {
    return (
      <div className="App">
        <div className="col-12 mt-3 fondo">
          <div className="row">
            <div className="">
              <label className="label">{" {  codeSide }"}</label>
            </div>
            <div className="">
              <label className="label-2">{"  recorridos de árboles "}</label>
            </div>
          </div>


          <form className="txt-field" noValidate autoComplete="off">
            <TextField
              style={{ fontSize: "40px" }}
              id="outlined-name"
              label="Expresión"
              className="txt"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              variant="outlined"
            />

          </form>
          <button type="button" className="btn btn-warning boton" onClick={this.nuevoArbol}>Recorrer <i className="fas fa-arrow-alt-circle-right"></i></button>
          <div className="resultados">
            <div><label className="rs">PreOrden:</label><label className="resultados-label">{this.state.preOrden}</label></div>
            <div><label className="rs">InOrden:</label><label className="resultados-label">{this.state.inOrden}</label></div>
            <div><label className="rs">PostOrden:</label><label className="resultados-label">{this.state.posOrden}</label></div>
          </div>
        </div>
        <div></div>
        <div>
          <label className="footer">Ilse Mayela Madrid Gutierrez <i className="fas fa-heart" style={{ color: "red", paddingTop: "20px" }}></i></label>
        </div>
      </div>
    );
  }
}

export default App;
