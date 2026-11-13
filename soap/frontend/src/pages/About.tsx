import { Link } from 'react-router-dom';
import { PageTitle } from '../components/ui';
export default function About() {
  return (
    <>
      <PageTitle
        title="Futebol, dados e curiosidade."
        eyebrow="SOBRE O CAMISA 21"
        description="Uma plataforma acadêmica para explorar o futebol e entender a integração entre sistemas."
      />
      <article className="panel prose">
        <h2>O que conecta cada placar</h2>
        <p>
          CAMISA 21 consulta o Football Pool Web Service usando SOAP, XML e WSDL. O frontend React
          conversa por HTTP/JSON com o backend FastAPI. O backend usa Zeep para construir mensagens
          SOAP a partir do contrato WSDL e converter as respostas.
        </p>
        <div className="architecture">
          <span>
            React / TypeScript<small>Interface de exploração</small>
          </span>
          <span>
            FastAPI / Pydantic<small>HTTP / JSON</small>
          </span>
          <span>
            Zeep / Football Pool<small>SOAP / XML + WSDL</small>
          </span>
        </div>
        <h2>O alcance dos dados</h2>
        <p>
          A validação inicial retornou um conjunto de 2026, com 48 seleções, 104 partidas e 16
          estádios. Não existe parâmetro de ano ou edição nas operações utilizadas. A interface
          mostra o período retornado a cada consulta.
        </p>
        <p>
          Os registros pertencem ao Football Pool e não foram certificados como resultados oficiais.
          O provedor pode alterar o conteúdo. A captura local é uma cópia real identificada, não uma
          base simulada; precisa ser escolhida explicitamente.
        </p>
        <h2>Como os números são calculados</h2>
        <p>
          Vitórias, empates, derrotas e gols consideram somente jogos marcados como concluídos.
          Pênaltis de desempate não são somados aos gols; um empate no placar continua empate para
          esses cálculos. Aproveitamento usa três pontos por vitória e um por empate. O ranking de
          jogadores é fornecido pelo serviço.
        </p>
        <h2>Limitações que ficam à vista</h2>
        <ul>
          <li>Não há arquivo completo de edições anteriores.</li>
          <li>Cadastro de jogadores não comprova escalação ou participação em uma partida.</li>
          <li>
            Não são exibidos posse de bola, finalizações, avaliações ou eventos de gols inexistentes
            no contrato utilizado.
          </li>
          <li>Partidas são associadas a cidades; o estádio exato não é confirmado.</li>
          <li>Cartões são relacionados por data e seleções, pois não incluem ID de partida.</li>
          <li>Classificação calculada não aplica todos os desempates oficiais.</li>
        </ul>
        <h2>Identidade independente</h2>
        <p>
          Organização inspirada em portais de resultados esportivos; paleta grená, dourada e creme
          inspirada na tradição da AS Roma. Sem uso de escudos ou logotipos proprietários dessas
          referências.
        </p>
        <p>
          <a
            href="https://footballpool.dataflex.dev/info.wso?WSDL"
            target="_blank"
            rel="noreferrer"
          >
            Contrato WSDL do Football Pool
          </a>
        </p>
        <Link className="button" to="/laboratorio">
          Explorar a comunicação SOAP
        </Link>
      </article>
    </>
  );
}
