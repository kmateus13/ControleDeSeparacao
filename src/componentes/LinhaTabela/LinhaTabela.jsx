import axios from "axios";
import Cronometro from "../Cronometro/Cronometro";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import './LinhaTabela.css'
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { NativeSelect } from '@mui/material';
import { IconButton } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Done from "@mui/icons-material/Done";
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';


export default function LinhaTabela({ id, separador, numeroPedido, tempoInicio, status, pausado }) {

    const [registrosSelecionados, setRegistrosSelecionados] = useState([]);


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
            tempoReal: conteudoCronometro,
            tempoDuracao:diferencaFormatada,
            status: true,
            pausado: estadoPausa,
            dataSep: dados.dataSep,
            id: { e }

        }
        axios.put(`http://localhost:3000/posts/${e}`, dadosAtualizado)
            .then((response) => {
                let resposta = response.data
                console.log(resposta)
            }).catch((erro) => {
                console.log(erro)
            })

            localStorage.removeItem(id)
    }


    function pausar(e) {
        // Inicie a solicitação com o estado atual
        const novoEstadoPausa = !pausado;

        axios.patch(`http://localhost:3000/posts/${e}`, { pausado: novoEstadoPausa, horaPausada: true })
            .then((response) => {
                let resposta = response.data;
                console.log(resposta);

                // Atualize o estado após a resposta da solicitação ser bem-sucedida
                setEstadoPausa(novoEstadoPausa);
                localStorage.setItem(id, conteudoCronometro)
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
        if (conteudoCronometro >= "01:00:00") {
            setCorDaLinha("corDaLinhaVermelha");
        } else if (conteudoCronometro >= "00:35:00")
            setCorDaLinha("corDaLinhaAmarela");
        else {
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
        if (selectedSeparador === "") {
            alert("Por favor, selecione um separador.");
        } else {
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

    const toggleSelecionarRegistro = (id) => {
        if (registrosSelecionados.includes(id)) {
            // Se o registro já estiver selecionado, remova-o
            setRegistrosSelecionados(registrosSelecionados.filter((registroId) => registroId !== id));
        } else {
            // Se o registro não estiver selecionado, adicione-o
            setRegistrosSelecionados([...registrosSelecionados, id]);
        }
    };

    const excluirRegistrosSelecionados = () => {
        


        if(window.confirm("deseja realmente deletar ?")){
            registrosSelecionados.forEach((id) => {
                // Envie solicitação de exclusão para o servidor com o id do registro
                axios.delete(`http://localhost:3000/posts/${id}`)
                    .then((response) => {
                        // Registro excluído com sucesso, pode atualizar o estado ou fazer outras ações
                        console.log(`Registro ${id} excluído.`);
                        localStorage.delete(id)
                    })
                    .catch((erro) => {
                        console.error(`Erro ao excluir registro ${id}:`, erro);
                    });
            });
    
            // Limpe a lista de registros selecionados
            setRegistrosSelecionados([]);
        }
        
    };




    return (
        <tr className={corDaLinha}>
            {status === false ? (
                <>
                    <td>
                        <input className="inputSelecionar"
                            type="checkbox"
                            onChange={() => toggleSelecionarRegistro(id)}
                            checked={registrosSelecionados.includes(id)}
                            style={{
                                display: registrosSelecionados.includes(id) ? 'none' : 'block',
                            }}
                        />
                        {registrosSelecionados.includes(id) ? (
                            <IconButton
                                variant="contained"
                                color="error"
                                onClick={excluirRegistrosSelecionados}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </td>
                </>
            ) : null}
            <td>
                <div className="btnEditarEsep" >
                    {editing ? (
                        <div>
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
                                       style={{margin: "0 auto"}}
                                        onChange={handleSeparadorChange}
                                    >
                                        <option>SELECIONE UM SEPARADOR</option>
                                        {separadores.map(separador => (
                                            <option key={separador.id} value={separador.name} >
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
                        (editing ? <IconButton color="error" aria-label="salvar" onClick={salvarNome} onChange={(e) => setSeparadorEditado(e.target.value)}><Done /></IconButton> :
                            <IconButton className="botao-de-erro" color="error" aria-label="editar" onClick={() => setEditing(true)}><Edit /></IconButton>
                        ) : null}
                </div>
            </td>
            <td>{numeroPedido}</td>
            <td>{tempoInicio}</td>
            <td>{dados.tempoReal ? dados.tempoReal : <Cronometro id={id} status={dados.status} pegarHoraPausada={pegarHoraPausada}  pausado={estadoPausa} />}</td>
            <td>{dados.tempoFim ? dados.tempoFim : "Aguardando..."}</td>
            <td>{dados.tempoDuracao ? dados.tempoDuracao : "Aguardando..."}</td>
            <td>
                {status === true ? <div className="circuloVerde"></div> :( pausado ? <div className="circuloAmarelo"></div>: <div className="circuloVermelho"></div>)}
            </td>
            <td>{status === true ? "Concluido"
                :
                <div className="btnActions">
                    <Button variant="contained" size="small" color={pausado ? "warning" : "error"} className="botaoDinamico" value={id} onClick={(e) => pausar(e.target.value)}>{dados.pausado ? "Retomar" : "Pausar"}</Button>
                    <Button size="small" variant="contained" color="error" value={id} onClick={(e) => finalizar(e.target.value)}>Finalizar</Button>
                </div>
            }</td>
        </tr>
    )
}