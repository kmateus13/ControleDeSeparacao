import './App.css';
import Inputs from './componentes/Inputs/Inputs';
import Tabela from './componentes/Tabela/Tabela';
import Relogio from './componentes/Relogio/Relogio';
import Aviso from './componentes/Aviso/Aviso';

function App() {
  return (
    <div className='containerBody'>
      <Relogio/>
      <Aviso/>
      <div id='ImgLogo'>
      <img src="/logo.png" alt="Logo da Minha Aplicação"/>
      </div>
     
      <Inputs/>
      <Tabela status={false}/>
      <h1>Pedidos Concluídos</h1>
      <Tabela status={true}/>
    </div>
  )
}

export default App;
