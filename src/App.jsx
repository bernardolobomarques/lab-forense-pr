import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [evidenceInput, setEvidenceInput] = useState('');
  const [suspectInput, setSuspectInput] = useState('');
  
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [bootStep, setBootStep] = useState(0);

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
      // Salva progresso na rede de evidências do HUB
      localStorage.setItem('ev_dna', 'true');
    }, 2000);
  };

  const closeModal = () => {
    setAnalysisResult(null);
  };

  useEffect(() => {
    if (bootStep < 3) {
      const timer = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  if (bootStep < 3) {
    return (
      <div className="lab-container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-mono)'}}>
        <div style={{color: 'var(--medical-blue)', fontSize: '1.2rem'}}>
          {bootStep === 0 && '> INICIALIZANDO SEQUENCIADOR CODIS v2.4...'}
          {bootStep === 1 && '> CALIBRANDO REAGENTES E LUZ FORENSE...'}
          {bootStep === 2 && '> SISTEMA GENÉTICO ONLINE. AGUARDANDO ALIMENTAÇÃO MANUAL.'}
        </div>
      </div>
    );
  }

  return (
    <div className="lab-container">


      <header>
        <div>
          <h1>SISTEMA CODIS</h1>
          <div className="system-id">POLITEC-PR :: DEPARTAMENTO DE GENÉTICA FORENSE</div>
        </div>
        <img src="./images/10.png" alt="Logo Lab" width="80" style={{filter: 'grayscale(100%)'}} />
      </header>

      {errorMsg && <div className="error-bar">⚠️ {errorMsg}</div>}

      <div className="lab-grid">
        <div className="panel">
          <h2 className="panel-title">MATERIAL DE ORIGEM IGNORADA</h2>
          <p className="helper-text">Insira a TAG do Laudo Pericial:</p>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="INSERIR CÓDIGO DA AMOSTRA" 
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
              placeholder="CÓDIGO DE GENÉTICA (CODIS)" 
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
                  <strong>⚠️ DIAGNÓSTICO DO SISTEMA PERICIAL: ANOMALIA ESTRUTURAL</strong>
                  <br/>Alerta de Contaminação Secundária. A análise de dispersão do tecido coletado indica ausência absoluta de gotículas satélites ou dispersão aerossolizada (espirro/fala). A densidade e o formato perfeitamente circular de 98% de concentração no epicentro do banco de superfície apontam para <span style={{color: 'red', fontWeight: 'bold'}}>TRANSFERÊNCIA DINÂMICA ARTIFICIAL</span> (depósito com instrumento médico, pipeta ou swab forçado). Aconselha-se suspensão de inquérito imediato sobre a fonte biológica primária.
                </div>
              )}

              {analysisResult.match && analysisResult.ev.id === '#FIO-11' && (
                <div className="trap-message">
                  <strong>⚠️ DIAGNÓSTICO DO SISTEMA PERICIAL: INSUFICIÊNCIA CAUSAL</strong>
                  <br/>O sequenciamento genético mitocondrial confirmou a identidade do folículo predatório na mala do veículo automotor. Perícia mecânica constata ausência de dano no bulbo (Sem traços de puxão). O cruzamento temporal atesta invasão civil ao automóvel com finalidade de extração material (furto). Todavia, o laudo legista N-4A demanda Força Opositora Maior de no mínimo uma alavanca de 40 quilogramas para laceração do hióide. O Indivíduo CODIS cruzado apresenta deficiência de biotipo para execução.
                </div>
              )}

              {analysisResult.match && analysisResult.ev.id === '#CIG-44' && (
                <div className="trap-message">
                  <strong>⚠️ CONCLUSÃO SISTÊMICA: PRESENÇA CONFIRMADA NO PERÍMETRO</strong>
                  <br/>A reação em cadeia de polimerase (PCR) na salivação impregnada no filtro de celulose correlaciona o indivíduo cadastrado à cena geográfica de abandono do veículo (distância relativa de 4 metros). A execução por via compressiva enquadra-se no biotipo mecânico laboral do indivíduo. AVISO: Indícios apontam contratação de terceiros logísticos devido à incompatibilidade sócio-econômica motivacional e financeira com a vítima titular (Ausência de dolo prévio).
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
