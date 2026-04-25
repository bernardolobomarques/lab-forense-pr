import { useState } from 'react'
import './App.css'

function App() {
  const [evidenceInput, setEvidenceInput] = useState('');
  const [suspectInput, setSuspectInput] = useState('');
  
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const evidences = [
    { id: '#AMX-09', name: 'AMOSTRA #AMX-09', desc: 'Saliva densa (Encosto do Passageiro)', sequence: 'ATCG-GCTA-TAAC' },
    { id: '#FIO-11', name: 'AMOSTRA #FIO-11', desc: 'Fio de Cabelo (Carpete Porta-Malas)', sequence: 'ATTA-CCGG-TTAA' },
    { id: '#CIG-44', name: 'AMOSTRA #CIG-44', desc: 'Ponta de Cigarro "Derby" (Acostamento)', sequence: 'GCTA-ATCG-TAAC' }
  ];

  const suspects = [
    { id: 'PR-LEM-992', name: 'CARLOS LEMOS', seq: 'CGTA-ATCG-GCAT' },
    { id: 'PR-SOU-310', name: 'MARCELO SOUZA', seq: 'ATCG-GCTA-TAAC' },
    { id: 'PR-ALV-008', name: 'ROBERTO ALVES', seq: 'GCTA-ATCG-TAAC' },
    { id: 'PR-LUC-544', name: 'LÚCIA FERNANDES', seq: 'ATTA-CCGG-TTAA' }
  ];

  const fetchEvidence = () => {
    const code = evidenceInput.trim().toUpperCase();
    const found = evidences.find(e => e.id === code);
    if (found) {
      setSelectedEvidence(found);
      setErrorMsg('');
    } else {
      setSelectedEvidence(null);
      setErrorMsg(`Evidência [${code}] não encontrada. Verifique laudo impresso.`);
    }
  };

  const fetchSuspect = () => {
    const code = suspectInput.trim().toUpperCase();
    const found = suspects.find(s => s.id === code);
    if (found) {
      setSelectedSuspect(found);
      setErrorMsg('');
    } else {
      setSelectedSuspect(null);
      setErrorMsg(`Perfil CODIS [${code}] não registrado no sistema.`);
    }
  };

  const handleAnalyze = () => {
    if (!selectedEvidence || !selectedSuspect) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isMatch = selectedEvidence.sequence === selectedSuspect.seq;
      setAnalysisResult({ 
        match: isMatch, 
        ev: selectedEvidence, 
        susp: selectedSuspect 
      });
    }, 2000);
  };

  const closeModal = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="lab-container">
      {showTutorial && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>🧬 POLITEC: Unidade de Genética</h2>
            <p>Bem-vindo ao sistema cruzado de bases biométricas.</p>
            <ul>
              <li>O sistema exige alimentação manual. Digite os códigos exatamente como constam nos relatórios físicos ou fichas.</li>
              <li>Códigos de evidência costumam iniciar com # (Ex: #AMX-09)</li>
              <li>Códigos de indivíduos (CODIS) acompanham o padrão regional (Ex: PR-XXX-YYY)</li>
              <li>Insira a amostra de material orgânico DE UM LADO e o código numérico do suspeito DO OUTRO.</li>
            </ul>
            <button onClick={() => setShowTutorial(false)} className="btn-modal">INICIALIZAR MÁQUINA</button>
          </div>
        </div>
      )}

      <header>
        <div>
          <h1>SISTEMA CODIS</h1>
          <div className="system-id">POLITEC-PR :: DEPARTAMENTO DE GENÉTICA FORENSE</div>
        </div>
        <img src="../../images/10.png" alt="Logo Lab" width="80" style={{filter: 'grayscale(100%)'}} />
      </header>

      {errorMsg && <div className="error-bar">⚠️ {errorMsg}</div>}

      <div className="lab-grid">
        <div className="panel">
          <h2 className="panel-title">MATERIAL DE ORIGEM IGNORADA</h2>
          <p className="helper-text">Insira a TAG do Laudo Pericial:</p>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Ex: #AMX-09" 
              value={evidenceInput} 
              onChange={(e) => setEvidenceInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEvidence()}
            />
            <button onClick={fetchEvidence}>BUSCAR</button>
          </div>

          {selectedEvidence && (
            <div className="loaded-card">
              <div className="tag">{selectedEvidence.id}</div>
              <div className="desc">{selectedEvidence.desc}</div>
              <div className="seq">{selectedEvidence.sequence}</div>
            </div>
          )}
        </div>

        <div className="panel">
          <h2 className="panel-title">BASE DE DADOS CRIMINAIS</h2>
          <p className="helper-text">Insira a TAG CODIS da Ficha do Suspeito:</p>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Ex: PR-SOU-310" 
              value={suspectInput} 
              onChange={(e) => setSuspectInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSuspect()}
            />
            <button onClick={fetchSuspect}>BUSCAR</button>
          </div>

          {selectedSuspect && (
            <div className="loaded-card">
              <div className="tag">{selectedSuspect.id}</div>
              <div className="desc">{selectedSuspect.name}</div>
              <div className="seq">{selectedSuspect.seq}</div>
            </div>
          )}
        </div>

        <div className="action-area">
          <button 
            className={`btn-analyze ${loading ? 'loading' : ''}`}
            disabled={!selectedEvidence || !selectedSuspect || loading}
            onClick={handleAnalyze}
          >
            {loading ? 'SEQUENCIANDO...' : 'INICIAR CRUZAMENTO GENÉTICO'}
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="popup-overlay">
          <div className="result-card">
            <div className={`result-header ${analysisResult.match ? 'match' : 'nomatch'}`}>
              <h2>{analysisResult.match ? 'MATCH CONFIRMADO' : 'INCOMPATÍVEL'}</h2>
            </div>
            <div className="result-body">
              <div className="confidence-ring">
                {analysisResult.match ? '99.8%' : '0.0%'}
              </div>
              <p style={{fontSize: '1.2rem'}}>
                A {analysisResult.ev.name} {analysisResult.match ? 'pertence a' : 'não pertence a'}<br/>
                <strong>{analysisResult.susp.name}</strong>
              </p>

              {analysisResult.match && analysisResult.ev.id === '#AMX-09' && (
                <div className="trap-message">
                  <strong>⚠️ ALERTA DO DETETIVE: O RED HERRING</strong>
                  <br/>Parece a prova final, não é? No entanto, leia o laudo com atenção. Ao redor de conflito letal, a saliva seria por gotículas ou sangue, não uma gota densa limpa caindo intacta no assento. Esta amostra de Marcelo foi INTENCIONALMENTE PLANTADA pelo mandante no carro.
                </div>
              )}

              {analysisResult.match && analysisResult.ev.id === '#FIO-11' && (
                <div className="trap-message">
                  <strong>⚠️ ALERTA DO DETETIVE: O FURTO</strong>
                  <br/>O cabelo pertencer a Lúcia comprova apenas que ela esteve revirando o carro. Corrobora a teoria de que ela furtou algo do veículo, mas estrangular alguém por trás usando as próprias mãos requer força bruta e altura, algo improvável para ela, e não explica o abandono do carro no Porto Seco.
                </div>
              )}

              {analysisResult.match && analysisResult.ev.id === '#CIG-44' && (
                <div className="trap-message">
                  <strong>⚠️ ALERTA DO DETETIVE: O ASSASSINO FÍSICO</strong>
                  <br/>A descoberta do cigarro na cena com o DNA do Borracheiro (Graxa) isola a responsabilidade física. Ele asfixiou Elisa. Mas por que razão o matador de um Porto Seco emboscaria a secretária distante? Fica claro a atuação de MATADOR DE ALUGUEL. A questão é: Quem enriquece com ela morta? Quem plantou o isqueiro perto dele? Procure falhas graves no pretenso álibi perfeito de internet.
                </div>
              )}

              <button className="btn-modal" style={{marginTop: '2rem'}} onClick={closeModal}>LIMPAR CRUZAMENTO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
