import React, { useEffect, useState } from "react";
import './Relogio.css';

export default function Relogio() {
    const [horaAtual, setHoraAtual] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = new Date();
            setHoraAtual(currentTime);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div id="relogio">
            {horaAtual.toLocaleTimeString()}
        </div>
    );
}
