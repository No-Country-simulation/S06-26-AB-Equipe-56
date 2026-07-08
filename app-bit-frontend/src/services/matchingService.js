// Mock Matching Engine for App BiT (NLP and ESG Explicabilidade Simulation)

const CANDIDATOS_POOL = [
  // Full Stack Devs (cargo_id = 1)
  {
    id: 'c1',
    nome: 'Mariana Costa Silveira',
    cargo: 'Desenvolvedora Full Stack',
    email: 'mariana.silveira@dev.com',
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
  {
    id: 'c14',
    nome: 'Clara Martins Neves',
    cargo: 'Desenvolvedora Full Stack',
    email: 'clara.neves@domain.com',
    score: 78,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'baixa_renda', label: 'Origem Periférica' }
    ],
    resumo: 'Desenvolvedora Full Stack Júnior com forte afinidade por metodologias ágeis, frontend responsivo (CSS/HTML) e persistência de dados em PostgreSQL.',
    explicabilidade: {
      skillsMatched: ['React.js', 'CSS/HTML', 'Git', 'REST APIs'],
      skillsMissing: ['Node.js', 'SQL Server'],
      esgFit: 'Apoia o pilar de diversidade de gênero e mobilidade social, promovendo a entrada de mulheres periféricas no mercado de tecnologia corporativo.',
      scoreExplanation: 'Score de 78%. Mostrou ótimo desempenho técnico básico e facilidade de adaptação a novos times durante as dinâmicas em grupo.'
    }
  },

  // Cientistas de Dados (cargo_id = 2)
  {
    id: 'c4',
    nome: 'Gabriela Mendes Santos',
    cargo: 'Cientista de Dados',
    email: 'gabriela.santos@data.com',
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
  {
    id: 'c10',
    nome: 'Amanda Rocha Lima',
    cargo: 'Cientista de Dados',
    email: 'amanda.lima@data.com',
    score: 85,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'raca', label: 'Negra' },
      { tipo: 'baixa_renda', label: 'Origem Periférica' }
    ],
    resumo: 'Cientista de dados com especialização em análise exploratória de dados, visualização (PowerBI/Tableau) e modelagem supervisionada com Python.',
    explicabilidade: {
      skillsMatched: ['Python', 'Pandas/NumPy', 'Scikit-Learn', 'REST APIs'],
      skillsMissing: ['SQL Server', 'NLP'],
      esgFit: 'Fortalece o pilar de diversidade étnico-racial em áreas de análise quantitativa e exatas, promovendo equidade de oportunidades de gênero.',
      scoreExplanation: 'Candidata com ótima base teórica de estatística e fit técnico de 85%. Excelente comunicação para apresentação de insights e reports para a gestão.'
    }
  },

  // Engenheiros de ML (cargo_id = 3)
  {
    id: 'c6',
    nome: 'Thales Pinheiro Ribeiro',
    cargo: 'Engenheiro de Machine Learning',
    email: 'thales.ribeiro@ml.com',
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
  {
    id: 'c11',
    nome: 'Jefferson Santos Cruz',
    cargo: 'Engenheiro de Machine Learning',
    email: 'jefferson.cruz@ml.com',
    score: 83,
    marcadores: [
      { tipo: 'raca', label: 'Negro' },
      { tipo: 'baixa_renda', label: 'Origem Periférica' }
    ],
    resumo: 'Engenheiro de Machine Learning júnior/pleno com foco em integração de pipelines de dados, feature stores e treinamento distribuído com PyTorch.',
    explicabilidade: {
      skillsMatched: ['Python', 'PyTorch', 'TensorFlow', 'Git'],
      skillsMissing: ['Kubernetes', 'MLOps'],
      esgFit: 'Contribui para a representatividade de minorias em inteligência artificial, impulsionando metas ESG de inclusão social e diversidade racial em engenharia.',
      scoreExplanation: 'Match de 83%. Excelente capacidade analítica e portfólio prático de engenharia de dados. Demonstra proatividade e facilidade de adaptação.'
    }
  },

  // Dev Front-end (cargo_id = 4)
  {
    id: 'c7',
    nome: 'Beatriz Vasconcelos Luna',
    cargo: 'Desenvolvedora Front-end',
    email: 'beatriz.luna@front.com',
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
  {
    id: 'c12',
    nome: 'Letícia Pereira Góes',
    cargo: 'Desenvolvedora Front-end',
    email: 'leticia.goes@front.com',
    score: 87,
    marcadores: [
      { tipo: 'genero', label: 'Mulher' },
      { tipo: 'lgbt', label: 'LGBTQIA+' }
    ],
    resumo: 'Desenvolvedora Front-end com sólida experiência em React.js, SPAs e animações CSS. Focada em criar experiências de usuário interativas e responsivas.',
    explicabilidade: {
      skillsMatched: ['React.js', 'CSS/HTML', 'Git', 'Figma'],
      skillsMissing: ['Tailwind CSS'],
      esgFit: 'Alinhada com metas afirmativas de representatividade de gênero e promoção da inclusão da comunidade LGBTQIA+ em times multidisciplinares de front-end.',
      scoreExplanation: 'Score de 87%. Candidata com excelente olho clínico para design e prototipagem no Figma. Demonstrou ótima performance em testes de desenvolvimento responsivo.'
    }
  },
  {
    id: 'c15',
    nome: 'Rafael Augusto Silva',
    cargo: 'Desenvolvedor Front-end',
    email: 'rafael.silva@front.com',
    score: 81,
    marcadores: [
      { tipo: 'pcd', label: 'PCD (Visual)' }
    ],
    resumo: 'Desenvolvedor Front-end júnior focado em acessibilidade web. Especialista em leitores de tela e desenvolvimento seguindo estritamente as regras da WCAG.',
    explicabilidade: {
      skillsMatched: ['React.js', 'CSS/HTML', 'Git'],
      skillsMissing: ['Figma', 'Tailwind CSS'],
      esgFit: 'Inclusão direta de pessoas com deficiência visual (PCD) no time de engenharia de software da empresa, promovendo o desenvolvimento de produtos acessíveis nativamente.',
      scoreExplanation: 'Score de 81%. Conhecimento excepcional e sem concorrência em normas de acessibilidade digital, sendo de extrema utilidade para auditoria de portais.'
    }
  },

  // Dev Back-end (cargo_id = 5)
  {
    id: 'c8',
    nome: 'Lucca Viana Ramos',
    cargo: 'Desenvolvedor Back-end',
    email: 'lucca.ramos@back.com',
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
  },
  {
    id: 'c9',
    nome: 'Tiago Mendes Neto',
    cargo: 'Desenvolvedor Back-end',
    email: 'tiago.mendes@back.com',
    score: 88,
    marcadores: [
      { tipo: 'pcd', label: 'PCD (Auditivo)' },
      { tipo: 'lgbt', label: 'LGBTQIA+' }
    ],
    resumo: 'Desenvolvedor Back-end focado em Node.js, arquiteturas orientadas a serviços e modelagem relacional avançada.',
    explicabilidade: {
      skillsMatched: ['Node.js', 'Express', 'SQL Server', 'REST APIs'],
      skillsMissing: ['Jest'],
      esgFit: 'Promove a representatividade de minorias em cargos de desenvolvimento técnico, atendendo metas de diversidade social e de inclusão de pessoas com deficiência.',
      scoreExplanation: 'Match de 88%. Demonstra sólido raciocínio de banco de dados relacional e criação de rotas Express estruturadas. Comunicação escrita exemplar.'
    }
  },
  {
    id: 'c13',
    nome: 'Bruno Carvalho Mello',
    cargo: 'Desenvolvedor Back-end',
    email: 'bruno.mello@back.com',
    score: 85,
    marcadores: [
      { tipo: 'idade', label: '50+' }
    ],
    resumo: 'Desenvolvedor Back-end sênior com vasta experiência em sistemas legados, migração de bancos de dados relacionais e otimização de queries complexas.',
    explicabilidade: {
      skillsMatched: ['Node.js', 'SQL Server', 'REST APIs'],
      skillsMissing: ['Express', 'Jest'],
      esgFit: 'Contribui para a inclusão etária (profissionais 50+), trazendo maturidade, mentoria técnica e inteligência de sistemas robustos para o time de desenvolvimento.',
      scoreExplanation: 'Match de 85%. Traz excelente background técnico em estruturas relacionais e otimização. Grande fit para segurança e arquitetura de banco de dados.'
    }
  },
  {
    id: 'c16',
    nome: 'Samuel de Oliveira',
    cargo: 'Desenvolvedor Back-end',
    email: 'samuel.oliveira@back.com',
    score: 82,
    marcadores: [
      { tipo: 'raca', label: 'Negro' }
    ],
    resumo: 'Desenvolvedor Back-end Júnior focado no ecossistema Node.js/Express. Experiência prática em bootcamps desenvolvendo integrações e middlewares.',
    explicabilidade: {
      skillsMatched: ['Node.js', 'Express', 'REST APIs', 'Git'],
      skillsMissing: ['SQL Server', 'Jest'],
      esgFit: 'Apoia as metas ESG de equidade racial em contratações de tecnologia da empresa, promovendo o desenvolvimento de desenvolvedores negros em início de carreira.',
      scoreExplanation: 'Match técnico de 82%. Excelente raciocínio lógico em testes rápidos de algoritmo e excelente atitude colaborativa demonstrada no processo.'
    }
  }
];

export const getCandidatesForJob = (cargoId, titulo = '') => {
  const parsedCargoId = parseInt(cargoId);
  let candidates = CANDIDATOS_POOL.filter(c => {
    if (parsedCargoId === 1) return c.cargo === 'Desenvolvedora Full Stack' || c.cargo === 'Desenvolvedor Full Stack';
    if (parsedCargoId === 2) return c.cargo === 'Cientista de Dados';
    if (parsedCargoId === 3) return c.cargo === 'Engenheiro de Machine Learning' || c.cargo === 'Engenheira de Machine Learning';
    if (parsedCargoId === 4) return c.cargo === 'Desenvolvedora Front-end' || c.cargo === 'Desenvolvedor Front-end';
    if (parsedCargoId === 5) return c.cargo === 'Desenvolvedor Back-end';
    return false;
  });

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

  if (candidates.length === 0) {
    candidates = CANDIDATOS_POOL.slice(0, 3);
  }

  return candidates.sort((a, b) => b.score - a.score);
};

export const getDiversityStats = () => {
  return {
    mulheres: 44,
    negros: 38,
    pcd: 8,
    lgbt: 18,
    baixaRenda: 25,
    esgTarget: 50,
    currentProgress: 42.6,
  };
};
