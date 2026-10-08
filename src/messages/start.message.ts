import { blockquote, bold, code, format, italic, underline } from "gramio";

export const buildStartMessage = (name: string) =>
  format`
      👋 Ciao ${name}

      ✨ Sono un bot che ti aiuta a generare un link Acestream ✨

        ${underline("📚 Come usarmi:")}
        🔹 Inviami l'host dove è in esecuzione l'engine Acestream e l'ID Acestream
        🔹 Ti risponderò con il link corretto

      ${bold("Host supportati:")}
      🔹 Locale: ${code("127.0.0.1:6878")}
      🔹 Server locale: ${code("192.168.1.101:6878")}
      🔹 Server remoto: ${code("http://35.152.250.128:6878")}

      ${bold("Esempi di input:")}
      ${code("192.168.1.101 f2df4f96b23388b45e75d848a48a510cf8af560f")}
      ${italic("oppure")}
      ${code("127.0.0.1:6878 acestream://f2df4f96b23388b45e75d848a48a510cf8af560f")}
      ${italic("oppure")}
      ${code("http://35.152.250.128:6878 f2df4f96b23388b45e75d848a48a510cf8af560f")}

      ${underline("❗️ Nota:")}
      ${italic("Non ospito né fornisco alcun contenuto Acestream, ti aiuto solo a generare il link corretto.")}

      ${blockquote(`⚠️ Per maggiori informazioni contatta lo sviluppatore:\n@m1keehrmantraut`)}
    `;
