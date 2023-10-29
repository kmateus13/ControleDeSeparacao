import React, { useEffect, useState } from 'react';


export default function Cronometro({ pausado, pegarHoraPausada, id, status }) {

  const [tempoAtual, setTempoAtual] = useState(converterParaSegundos("00:00:00"));

  function converterParaSegundos(tempo) {
    if (tempo) {
      const partes = tempo.split(":");
      const horas = parseInt(partes[0], 10) * 3600;
      const minutos = parseInt(partes[1], 10) * 60;
      const segundos = parseInt(partes[2], 10);
      return horas + minutos + segundos;
    }
    return 0; 
  }


  useEffect(() => {
    // Redefine a contagem sempre que localStorage for atualizado

    setTempoAtual(converterParaSegundos(localStorage.getItem(id)));

  }, [id]);

  useEffect(() => {
    if (!pausado) {
      const intervalo = setInterval(() => {
        setTempoAtual(tempoAtual => tempoAtual + 1);
      }, 1000);

      return () => {
        clearInterval(intervalo);
      }
    }
  }, [pausado]);

  const segundos = tempoAtual % 60;
  const minutos = Math.floor((tempoAtual / 60) % 60);
  const horas = Math.floor(tempoAtual / 3600);

  const horaFormatada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;


  useEffect(() => {

    pegarHoraPausada(horaFormatada)

  }, [horaFormatada, pegarHoraPausada])


  useEffect(() => {
    if (status === undefined) {
     
    } else if (status === false) {
      window.addEventListener("beforeunload", () => {
        localStorage.setItem(id, horaFormatada)
      })
    }
  }, [horaFormatada, id, status])


  return (
    <div>{horaFormatada}
    </div>

  )

}
