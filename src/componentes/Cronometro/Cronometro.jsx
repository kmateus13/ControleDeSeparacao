import React, { useEffect, useState } from 'react';

export default function Cronometro({ horaInicio, pausado, pegarHoraPausada, horaPausada }) {
  const [tempoDecorrido, setTempoDecorrido] = useState("00:00:00");
  

  useEffect(() => {
    if (!horaPausada) {
      if (!pausado) {
        const interval = setInterval(() => {
          const [horas, minutos, segundos] = horaInicio.split(':').map(Number);
          const horaDeInicio = new Date();
          const horaAtual = new Date();

          horaDeInicio.setHours(horas);
          horaDeInicio.setMinutes(minutos);
          horaDeInicio.setSeconds(segundos);

          const tempoDecorridoMillis = horaAtual - horaDeInicio;
          const hora = String(Math.floor(tempoDecorridoMillis / 3600000)).padStart(2, "0");
          const minuto = String(Math.floor((tempoDecorridoMillis % 3600000) / 60000)).padStart(2, "0");
          const segundo = String(Math.floor((tempoDecorridoMillis % 60000) / 1000)).padStart(2, "0");

          setTempoDecorrido(`${hora}:${minuto}:${segundo}`);

        }, 1000);

        // Limpando o intervalo quando o componente é desmontado
        return () => clearInterval(interval);
      }
    }

  }, [horaInicio, pausado, horaPausada]);




  // ----------------------------------------------------------------------


  const [tempoAtual, setTempoAtual] = useState(converterParaSegundos(horaPausada));

  function converterParaSegundos(tempo) {
    if (tempo) {
      const partes = tempo.split(":");
      const horas = parseInt(partes[0], 10) * 3600;
      const minutos = parseInt(partes[1], 10) * 60;
      const segundos = parseInt(partes[2], 10);
      return horas + minutos + segundos;
    }
    return 0; // Return a default value if tempo is undefined
  }


  useEffect(() => {
    // Redefine a contagem sempre que horaPausada for atualizado

    setTempoAtual(converterParaSegundos(horaPausada));

  }, [horaPausada]);

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
    if (horaPausada) {
      pegarHoraPausada(horaFormatada)
    } else {
      pegarHoraPausada(tempoDecorrido)
    }
  }, [pegarHoraPausada, tempoDecorrido, horaFormatada, horaPausada])

  return (
    <div>{horaPausada ? horaFormatada : tempoDecorrido}</div>
    
  )
  
}
