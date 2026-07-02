// Mock Matching Engine for App BiT (NLP and ESG Explicabilidade Simulation)

const CANDIDATOS_POOL = [
  // Full Stack Devs (cargo_id = 1)
  {
    id: 'c1',
    nome: 'Mariana Costa Silveira',
    cargo: 'Desenvolvedora Full Stack',
    email: 'mariana.silveira@dev.com',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    score: 96,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'lgbt', label: 'LGBTQIA+' }
    ],
    resumo: 'Desenvolvedora Full Stack com 3 anos de experiência em React.js, Express, Node.js e SQL Server. Apaixonada por acessibilidade web e código limpo.',
    explicabilidade: {
      skillsMatched: ['React.js', 'Node.js', 'Express', 'SQL Server', 'REST APIs'],
      skillsMissing: ['TypeScript'],
      esgFit: 'Aumenta em 5% a representatividade feminina e LGBTQIA+ no time de desenvolvimento técnico, alinhando-se com a meta ESG de igualdade de gênero em cargos de tecnologia.',
      scoreExplanation: 'Possui excelente aderência técnica com 96% de compatibilidade. Desenvolveu anteriormente um portal SaaS completo utilizando a mesma stack tecnológica da vaga. Demonstra facilidade em testes unitários.'
    }
  },
  {
    id: 'c2',
    nome: 'Carlos Eduardo Souza (Cadu)',
    cargo: 'Desenvolvedor Full Stack',
    email: 'cadu.souza@dev.com',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    score: 89,
    marcadores: [
      { tipo: 'pcd', label: 'PCD (Auditivo)' }
    ],
    resumo: 'Dev Full Stack Júnior/Pleno focado em ecossistema Javascript (React/Node) e integração de APIs. Entusiasta de arquiteturas orientadas a eventos.',
    explicabilidade: {
      skillsMatched: ['React.js', 'Node.js', 'Express', 'Git'],
      skillsMissing: ['SQL Server'],
      esgFit: 'Promove a inclusão de pessoas com deficiência (PCD) no setor tecnológico da empresa, ajudando a cumprir a cota legal e a meta interna de diversidade social.',
      scoreExplanation: 'Candidato com sólida base teórica e portfólio prático robusto. Teve match de 89% com destaque para arquitetura de API. Necessita apenas de breve onboarding sobre modelagem em SQL Server.'
    }
  },
  {
    id: 'c3',
    nome: 'Aline Souza de Jesus',
    cargo: 'Desenvolvedora Full Stack',
    email: 'aline.jesus@dev.com',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120',
    score: 84,
    marcadores: [
      { tipo: 'raca', label: 'Negra' },
      { tipo: 'baixa_renda', label: 'Origem Periférica' }
    ],
    resumo: 'Formada pelo bootcamp Oracle Next Education (ONE). Especialista em lógica de programação, React.js e bancos de dados não relacionais.',
    explicabilidade: {
      skillsMatched: ['React.js', 'Node.js', 'Git', 'CSS/HTML'],
      skillsMissing: ['Express', 'SQL Server'],
      esgFit: 'Alinhada à meta ESG de mobilidade social e diversidade racial. Contribui para a inclusão de talentos de baixa renda e egressos de bootcamps de impacto social.',
      scoreExplanation: 'Match de 84%. Excelente raciocínio lógico e velocidade de aprendizado demonstrada no processo. Possui fortes soft skills, com destaque para trabalho em equipe e comunicação.'
    }
  },

  // Cientistas de Dados (cargo_id = 2)
  {
    id: 'c4',
    nome: 'Gabriela Mendes Santos',
    cargo: 'Cientista de Dados',
    email: 'gabriela.santos@data.com',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    score: 97,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'raca', label: 'Parda' }
    ],
    resumo: 'Especialista em NLP, extração de insights, Python e modelagem preditiva. 4 anos de experiência no mercado financeiro otimizando algoritmos de crédito.',
    explicabilidade: {
      skillsMatched: ['Python', 'SQL Server', 'NLP', 'Pandas/NumPy', 'Scikit-Learn'],
      skillsMissing: ['Docker'],
      esgFit: 'Promove equidade de gênero e diversidade étnica em áreas de STEM (Ciência, Tecnologia, Engenharia e Matemática), um dos principais pilares do relatório ESG anual da corporação.',
      scoreExplanation: 'Altíssimo nível de compatibilidade técnica (97%). Conhecimento avançado em Processamento de Linguagem Natural (NLP), altamente aplicável aos projetos de triagem anti-viés da empresa.'
    }
  },
  {
    id: 'c5',
    nome: 'Youssef Al-Fayed',
    cargo: 'Cientista de Dados',
    email: 'youssef.data@domain.com',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    score: 90,
    marcadores: [
      { tipo: 'raca', label: 'Refugiado / Imigrante' }
    ],
    resumo: 'Cientista de Dados sênior especializado em algoritmos de regressão e clustering. Experiência internacional com grandes volumes de dados (PySpark).',
    explicabilidade: {
      skillsMatched: ['Python', 'SQL Server', 'Pandas/NumPy', 'Machine Learning'],
      skillsMissing: ['NLP'],
      esgFit: 'Contribui para a diversidade cultural e internacionalização das equipes técnicas, apoiando programas de inclusão de refugiados/imigrantes altamente qualificados.',
      scoreExplanation: 'Score de 90%. Demonstra grande maturidade na criação de modelos estatísticos complexos e engenharia de features de alta escala.'
    }
  },

  // Engenheiros de ML (cargo_id = 3)
  {
    id: 'c6',
    nome: 'Thales Pinheiro Ribeiro',
    cargo: 'Engenheiro de Machine Learning',
    email: 'thales.ribeiro@ml.com',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
    score: 94,
    marcadores: [
      { tipo: 'raca', label: 'Negro' }
    ],
    resumo: 'Engenheiro de Computação focado em otimização e deploy de modelos de Deep Learning em produção (MLOps). Experiente com PyTorch e Kubernetes.',
    explicabilidade: {
      skillsMatched: ['Python', 'PyTorch', 'TensorFlow', 'Kubernetes', 'MLOps'],
      skillsMissing: ['AWS Cloud'],
      esgFit: 'Apoia a meta de representatividade racial em cargos de alta complexidade técnica e inteligência artificial (IA), reduzindo o viés de contratação em cargos sênior.',
      scoreExplanation: 'Forte bagagem em otimização de modelos e colocação de modelos em produção (94% de match). Entende profundamente de algoritmos de otimização de latência.'
    }
  },

  // Dev Front-end (cargo_id = 4)
  {
    id: 'c7',
    nome: 'Beatriz Vasconcelos Luna',
    cargo: 'Desenvolvedora Front-end',
    email: 'beatriz.luna@front.com',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    score: 95,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'baixa_renda', label: 'Bolsista Prouni' }
    ],
    resumo: 'Desenvolvedora Front-end apaixonada por UI/UX, CSS avançado, React.js, Tailwind CSS e acessibilidade digital (normas WCAG).',
    explicabilidade: {
      skillsMatched: ['React.js', 'Tailwind CSS', 'CSS/HTML', 'Git', 'Figma'],
      skillsMissing: ['TypeScript'],
      esgFit: 'Promove a inclusão de mulheres de origem humilde (ex-bolsistas) no mercado de tecnologia, impactando diretamente o indicador ESG de igualdade de oportunidades.',
      scoreExplanation: 'Match técnico excelente de 95% para front-end. Destaca-se por portfólio focado em design inclusivo e interfaces com alto nível de acessibilidade digital.'
    }
  },

  // Dev Back-end (cargo_id = 5)
  {
    id: 'c8',
    nome: 'Lucca Viana Ramos',
    cargo: 'Desenvolvedor Back-end',
    email: 'lucca.ramos@back.com',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120&h=120',
    score: 93,
    marcadores: [
      { tipo: 'lgbt', label: 'Transgênero' }
    ],
    resumo: 'Especialista em Node.js, arquitetura de microserviços, modelagem de banco de dados SQL/NoSQL e testes automatizados.',
    explicabilidade: {
      skillsMatched: ['Node.js', 'Express', 'SQL Server', 'REST APIs', 'Jest'],
      skillsMissing: ['GraphQL'],
      esgFit: 'Fomenta a inclusão e o acolhimento de pessoas transgêneras no ecossistema corporativo B2B, atingindo metas afirmativas cruciais da agenda social da empresa.',
      scoreExplanation: 'Match de 93% com maestria em segurança de APIs e testes automatizados. O candidato já trabalhou com infraestrutura Express robusta semelhante à nossa.'
    }
  }
];

export const getCandidatesForJob = (cargoId, titulo = '') => {
  // Try to match based on cargoId first
  const parsedCargoId = parseInt(cargoId);
  let candidates = CANDIDATOS_POOL.filter(c => {
    if (parsedCargoId === 1) return c.cargo === 'Desenvolvedora Full Stack' || c.cargo === 'Desenvolvedor Full Stack';
    if (parsedCargoId === 2) return c.cargo === 'Cientista de Dados';
    if (parsedCargoId === 3) return c.cargo === 'Engenheiro de Machine Learning';
    if (parsedCargoId === 4) return c.cargo === 'Desenvolvedora Front-end';
    if (parsedCargoId === 5) return c.cargo === 'Desenvolvedor Back-end';
    return false;
  });

  // If no candidates matched the exact cargo_id, look at the title
  if (candidates.length === 0 && titulo) {
    const lowTitle = titulo.toLowerCase();
    if (lowTitle.includes('full') || lowTitle.includes('stack')) {
      candidates = CANDIDATOS_POOL.filter(c => c.cargo.includes('Full Stack'));
    } else if (lowTitle.includes('data') || lowTitle.includes('dados') || lowTitle.includes('cientista')) {
      candidates = CANDIDATOS_POOL.filter(c => c.cargo.includes('Dados'));
    } else if (lowTitle.includes('learning') || lowTitle.includes('ml') || lowTitle.includes('machine')) {
      candidates = CANDIDATOS_POOL.filter(c => c.cargo.includes('Machine'));
    } else if (lowTitle.includes('front') || lowTitle.includes('design') || lowTitle.includes('web')) {
      candidates = CANDIDATOS_POOL.filter(c => c.cargo.includes('Front'));
    } else if (lowTitle.includes('back') || lowTitle.includes('api') || lowTitle.includes('node')) {
      candidates = CANDIDATOS_POOL.filter(c => c.cargo.includes('Back'));
    }
  }

  // Fallback: if still empty, return a subset of developers
  if (candidates.length === 0) {
    candidates = CANDIDATOS_POOL.slice(0, 3);
  }

  // Sort candidates by score descending
  return candidates.sort((a, b) => b.score - a.score);
};

export const getDiversityStats = () => {
  // Returns ESG statistics for the company dashboard
  return {
    mulheres: 44, // 44%
    negros: 38, // 38%
    pcd: 8, // 8%
    lgbt: 18, // 18%
    baixaRenda: 25, // 25%
    esgTarget: 50, // Goal: 50% average representation of underrepresented groups
    currentProgress: 42.6, // Overall index
  };
};
