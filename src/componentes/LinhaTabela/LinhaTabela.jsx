import axios from "axios";
import Cronometro from "../Cronometro/Cronometro";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import './LinhaTabela.css'

export default function LinhaTabela({ id, separador, numeroPedido, tempoInicio, status, pausado, dataSep }) {

    const [dados, setDados] = useState([])
    const [estadoPausa, setEstadoPausa] = useState(pausado)
    const [conteudoCronometro, setConteudoCronometro] = useState()


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
            TempoDuracao: diferencaFormatada,
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


    useEffect(() => {

        axios.get(`http://localhost:3000/posts/${id}`)
            .then((response) => {

                let resposta = response.data
                setDados(resposta)

            }).catch((erro) => {
                console.log(erro)
            })
    }, [dados])

    return (
        <tr>
            <td>{separador}</td>
            <td>{numeroPedido}</td>
            <td>{tempoInicio}</td>
            <td>{dados.TempoDuracao ? dados.TempoDuracao : <Cronometro pegarHoraPausada={pegarHoraPausada} horaPausada={dados.horaPausada} horaInicio={tempoInicio} pausado={estadoPausa} />}</td>
            <td>{dados.tempoFim ? dados.tempoFim : "Aguardando..."}</td>
            <td>{dados.TempoDuracao ? dados.TempoDuracao : "Aguardando..."}</td>
            <td>
                {status === true ? <div className="circuloVerde"></div> : <div className="circuloVermelho"></div>}
            </td>
            <td>{status === true ? "Concluido"
                :
                <div className="btnActions">
                    <Button variant="contained" color="error" value={id} onClick={(e) => pausar(e.target.value)}>{dados.pausado ? "Retomar" : "Pausar"}</Button>
                    <Button variant="contained" color="error" value={id} onClick={(e) => finalizar(e.target.value)}>Finalizar</Button>
                </div>
            }</td>
        </tr>
    )
}