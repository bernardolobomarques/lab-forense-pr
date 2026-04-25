import { useState } from 'react'
import './App.css'

function App() {
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Amostra do Crime
  const crimeSample = {
    id: 'AMX-09',
    name: 'AMOSTRA CRIMINAL #AMX-09',
    desc: 'Swab coletado do encosto do banco do passageiro (Veículo).',
    sequence: 'ATCG-GCTA-TAAC'
  };

  // Banco de Dados da Polícia
  const suspects = [
    { id: '1', name: 'PERFIL 1 (Carlos Lemos)', seq: 'CGTA-ATCG-GCAT' },
    { id: '2', name: 'PERFIL 2 (Marcelo Souza)', seq: 'ATCG-GCTA-TAAC' },
    { id: '3', name: 'PERFIL 3 (Roberto Alves)', seq: 'GCTA-ATCG-TAAC' },
    { id: '4', name: 'PERFIL 4 (Lúcia Fernandes)', seq: 'ATTA-CCGG-TTAA' }
  ];

  const handleAnalyze = () => {
    if (!selectedSample || !selectedSuspect) return;

    if (selectedSample.sequence === selectedSuspect.seq) {
      setAnalysisResult({ match: true, suspect: selectedSuspect });
    } else {
      setAnalysisResult({ match: false, suspect: selectedSuspect });
    }
  };

  const closeModal = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="lab-container">
      <header>
        <div>
          <h1>SISTEMA CODIS</h1>
          <div className="system-id">POLITEC-PR :: DEPARTAMENTO DE GENÉTICA FORENSE</div>
        </div>
        <img src="../../images/10.png" alt="Logo Lab" width="80" style={{filter: 'grayscale(100%)'}} />
      </header>

      <div className="lab-grid">
        <div className="panel">
          <h2 className="panel-title">MATERIAL DA CENA DO CRIME</h2>
          <div 
            className={`sample-card ${selectedSample ? 'selected' : ''}`}
            onClick={() => setSelectedSample(crimeSample)}
          >
            <div className="sample-name">{crimeSample.name}</div>
            <div style={{fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '10px'}}>{crimeSample.desc}</div>
            <div className="dna-seq">{crimeSample.sequence}</div>
            {selectedSample && <span style={{color: 'var(--medical-dark)', fontWeight: 'bold', fontSize: '0.8rem'}}>SELECIONADO PARA TESTE</span>}
          </div>
          <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>Selecione a amostra acima para habilitar o comparador biológico.</p>
        </div>

        <div className="panel">
          <h2 className="panel-title">BANCO DE DADOS (SUSPEITOS)</h2>
          <div className="suspect-list">
            {suspects.map(susp => (
              <div 
                key={susp.id}
                className={`suspect-card ${selectedSuspect?.id === susp.id ? 'selected' : ''}`}
                onClick={() => setSelectedSuspect(susp)}
              >
                <div className="s-name">{susp.name}</div>
                <div className="s-seq">{susp.seq}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-area">
          <button 
            className="btn-analyze" 
            disabled={!selectedSample || !selectedSuspect}
            onClick={handleAnalyze}
          >
            INICIAR SEQUENCIAMENTO CRUZADO
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="modal-overlay">
          <div className="result-card">
            <div className={`result-header ${analysisResult.match ? 'match' : 'nomatch'}`}>
              <h2>{analysisResult.match ? 'MATCH CONFIRMADO' : 'INCOMPATÍVEL'}</h2>
            </div>
            <div className="result-body">
              <div className="confidence-ring">
                {analysisResult.match ? '99.8%' : '0.0%'}
              </div>
              <p style={{fontSize: '1.2rem'}}>
                Amostra #AMX-09 {analysisResult.match ? 'pertence a' : 'não pertence a'}<br/>
                <strong>{analysisResult.suspect.name}</strong>
              </p>

              {analysisResult.match && (
                <div className="trap-message">
                  <strong>⚠️ ALERTA DO DETETIVE CARVALHO:</strong>
                  <br/><br/>
                  Parece impossível negar, não é? O Ex-marido abusivo é o dono dessa saliva! O caso está encerrado... 
                  <br/><br/>
                  No entanto, abra e leia novamente o Laudo Pericial Físico (Ato 2). O laudo afirma ser "Saliva" pura em forma de gota densa depositada isolada no MEIO do encosto de um carro. 
                  Sem sangue, sem lutas, sem dispersão de espirro ou grito num formato de "pool seco". 
                  <br/><br/>
                  Sangue você derrama. <em>Mas como se transfere uma gota densa de saliva limpa e intocada para um banco de carro sem interagir com nada no entorno?</em> 
                  <br/><br/>
                  A amostra foi <strong>PLANTADA</strong>. O suspeito forneceu a saliva ao matador sem saber, possivelmente extraída durante algum exame clínico cotidiano dele ou do próprio filho.
                  Você quase prendeu o cara errado. Procure outro álibi furado.
                </div>
              )}

              <button className="btn-close" onClick={closeModal}>FECHAR E LIMPAR ÁREA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
