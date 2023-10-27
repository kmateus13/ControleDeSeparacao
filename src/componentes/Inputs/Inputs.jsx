import axios from 'axios';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { NativeSelect } from '@mui/material';
import { Done } from '@mui/icons-material';

export default function Inputs() {

    //const [campoSeparador, setCampoSeparador] = useState('')
    const [campoPedido, setCampoPedido] = useState('')
    const TempoInicio = new Date()
    const DataSep = new Date()

    const [separadores, setSeparadores] = useState([]);
    const [selectedSeparador, setSelectedSeparador] = useState('');

    let informacoes = {
        separador: selectedSeparador,
        numeroPedido: campoPedido,
        tempoInicio: TempoInicio.toLocaleTimeString(),
        dataSep: DataSep.toLocaleDateString(),
        status: false,
    }

    function enviarInformacoes() {
        if (selectedSeparador ==="" ||selectedSeparador === "SELECIONE UM SEPARADOR" || campoPedido.trim() === '') {
            alert("Por favor, selecione um separador e insira um número de pedido.");            
        }else{
            axios.post(`http://localhost:3000/posts`, informacoes)
            .then((response) => {
                console.log('Dados adicionados com sucesso:', response.data);
                // Faça o que for necessário após o sucesso da requisição
            })
            .catch((error) => {
                console.error('Erro ao adicionar novo vídeo:', error);
                // Lide com o erro de alguma forma
            });
            
            setCampoPedido('');
        }
        
    }

    useEffect(() => {
        // Faz uma solicitação GET para a API JSON-Server para obter os dados dos separadores
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
        <header>
            <h1>CONTROLE DE TEMPO DE SERAPARAÇÃO</h1>
            <div className={styles.container}>

                <span>
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
                            <option value="">SELECIONE UM SEPARADOR</option>
                            {separadores.map(separador => (
                                <option  key={separador.id} value={separador.name}>
                                    {separador.name}
                                </option>
                            ))}
                        </NativeSelect>
                </FormControl> 
                </span>
                <span>
                <TextField variant="filled" label="Número de pedido" type="text" id="numeroPedido" value={campoPedido} onChange={(e) => setCampoPedido(e.target.value)} />
                </span>
                <Button variant="contained" id="nomeSeparador" color='error' startIcon={<Done />} onClick={() => enviarInformacoes()}>INICIAR</Button>
            </div>
        </header>
    )
    //<label htmlFor="nomeSeparador">Nome do Separador: </label>
    //<input type="text" id="nomeSeparador" value={campoSeparador} onChange={(e) => setCampoSeparador(e.target.value)} />
    //<label htmlFor="numeroPedido">Numero do Pedido: </label>
}