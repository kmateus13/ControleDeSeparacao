import axios from "axios";
import Cronometro from "../Cronometro/Cronometro";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import './LinhaTabela.css'
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { NativeSelect } from '@mui/material';
import {IconButton} from "@mui/material";
import  Edit from "@mui/icons-material/Edit";
import  Done from "@mui/icons-material/Done";


export default function LinhaTabela({ id, separador, numeroPedido, tempoInicio, status, pausado}) {

    const [dados, setDados] = useState([])
    const [estadoPausa, setEstadoPausa] = useState(pausado)
    const [conteudoCronometro, setConteudoCronometro] = useState()
    
    const [editing, setEditing] = useState(false);
    const [separadorEditado, setSeparadorEditado] = useState(separador);

    const [corDaLinha, setCorDaLinha] = useState("");

    const [separadores, setSeparadores] = useState([]);
    const [selectedSeparador, setSelectedSeparador] = useState('');

    function finalizar(e) {
        const tempoFim = new Date().toLocaleTimeString()


        const [horasFim, minutosFim, segundosFim] = tempoFim.split(":");
        const [horasInicio, minutosInicio, segundosInicio] = tempoInicio.split(":");

        const horasFimNum = parseInt(horasFim, 10);
        const minutosFimNum = parseInt(minutosFim, 10);
        const segundosFimNum = parseInt(segundosFim, 10);

        const horasInicioNum = parseInt(horasInicio, 10);
        const minutosInicioNum = parseInt(minutosInicio, 10);
        const segundosInicioNum = parseInt(segundosInicio, 10);

        const diferencaEmSegundos = (horasFimNum - horasInicioNum) * 3600 +
            (minutosFimNum - minutosInicioNum) * 60 +
            (segundosFimNum - segundosInicioNum) 

        const diferencaFormatada = new Date(diferencaEmSegundos * 1000).toISOString().substr(11, 8);

        
        let dadosAtualizado = {
            separador: separador,
            numeroPedido: numeroPedido,
            tempoInicio: tempoInicio,
            tempoFim: tempoFim,
            tempoDuracao: diferencaFormatada,
            status: true,
            pausado: estadoPausa,
            dataSep:dados.dataSep,
            id: { e }

        }


        axios.put(`http://localhost:3000/posts/${e}`, dadosAtualizado)
            .then((response) => {
                let resposta = response.data
                console.log(resposta)
            }).catch((erro) => {
                console.log(erro)
            })
    }


    function pausar(e) {
        // Inicie a solicitação com o estado atual
        const novoEstadoPausa = !pausado;

        axios.patch(`http://localhost:3000/posts/${e}`, { pausado: novoEstadoPausa, horaPausada: conteudoCronometro})
            .then((response) => {
                let resposta = response.data;
                console.log(resposta);

                // Atualize o estado após a resposta da solicitação ser bem-sucedida
                setEstadoPausa(novoEstadoPausa);

            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    const pegarHoraPausada = (valor) => {
        setConteudoCronometro(valor)
    }

    // Defina a quantidade de minutos desejada PARA A LINHA MUDAR DE COR
    useEffect(() => {
    if(conteudoCronometro >= "01:00:00"){
        setCorDaLinha("corDaLinhaVermelha"); 
    }else if(conteudoCronometro >= "00:35:00") 
        setCorDaLinha("corDaLinhaAmarela"); 
    else{
        setCorDaLinha("")
    }     
    }, [conteudoCronometro]);


    useEffect(() => {
        axios.get(`http://localhost:3000/posts/${id}`)
            .then((response) => {

                let resposta = response.data
                setDados(resposta)
            }).catch((erro) => {
                console.log(erro)
            })
    }, [dados])


    // SALVA O NOME DEPOIS DE EDITADO NO JSON
    function salvarNome() {
        if (selectedSeparador ===""){
            alert("Por favor, selecione um separador."); 
        }else{
            axios
            .patch(`http://localhost:3000/posts/${id}`, { separador: selectedSeparador })
            .then((response) => {
                console.log("Nome do separador atualizado com sucesso.");
                // Desabilitar a edição após a atualização
                setEditing(false);
            })
            .catch((erro) => {
                console.log(erro);
        });
        } 
    }

    // Faz uma solicitação GET para a API JSON-Server para obter os dados dos separadores
    useEffect(() => {
        axios.get('http://localhost:3000/funcionarios')
            .then(response => {
                // Define os dados dos separadores no estado
                setSeparadores(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar os separadores:', error);
            });
    }, []);

    const handleSeparadorChange = (event) => {
        setSelectedSeparador(event.target.value);
    };

    return (
        <tr className={corDaLinha}>
            <td>
            <div className="btnEditarEsep" >
            {editing ? (
                    <div>
                        {/*<input
                            type="text"
                            value={separadorEditado}
                            onChange={(e) => setSeparadorEditado(e.target.value)}
                        />*/}
                        <div className="inputSepadoresEdit">
                        <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">  
                        </InputLabel>
                        <NativeSelect
                            value={selectedSeparador}
                            inputProps={{
                                name: 'separador',
                                id: 'uncontrolled-native',
                            }}
                            
                            onChange={handleSeparadorChange}
                        >   
                            <option>SELECIONE UM SEPARADOR</option>
                            {separadores.map(separador => (
                                <option  key={separador.id} value={separador.name}>
                                    {separador.name}
                                </option>
                            ))}
                        </NativeSelect>
                        </FormControl> 
                        </div>
                    </div>
                ) : (
                    separador
                )}
                {status === false ? 
                ( editing ? <IconButton  color="error" aria-label="salvar" onClick={salvarNome} onChange={(e) => setSeparadorEditado(e.target.value)}><Done/></IconButton> :
                //<Button size="small" variant="contained" startIcon={<Done />} color="error" onClick={salvarNome} onChange={(e) => setSeparadorEditado(e.target.value)}>Salvar</Button> :
                //<IconButton size="small" variant="contained" className="botao-de-erro" onClick={() => setEditing(true)}></IconButton>
                <IconButton  className="botao-de-erro"  color="error" aria-label="editar" onClick={() => setEditing(true)}><Edit/></IconButton>

                ) : null} 
                 </div>    
            </td> 
            <td>{numeroPedido}</td>
            <td>{tempoInicio}</td>
            <td>{dados.tempoDuracao ? dados.tempoDuracao : <Cronometro pegarHoraPausada={pegarHoraPausada} horaPausada={dados.horaPausada} horaInicio={tempoInicio} pausado={estadoPausa} />}</td>
            <td>{dados.tempoFim ? dados.tempoFim : "Aguardando..."}</td>
            <td>{dados.tempoDuracao ? dados.tempoDuracao : "Aguardando..."}</td>
            <td>
                {status === true ? <div className="circuloVerde"></div> : <div className="circuloVermelho"></div>}
            </td>
            <td>{status === true ? "Concluido"
                :
                <div className="btnActions">
                    {/*<Button variant="contained" color="error" value={id} onClick={(e) => pausar(e.target.value)}>{dados.pausado ? "Retomar" : "Pausar"}</Button>*/}
                    <Button size="small" variant="contained" color="error" value={id} onClick={(e) => finalizar(e.target.value)}>Finalizar</Button>
                </div>
            }</td>
        </tr>
    )
}