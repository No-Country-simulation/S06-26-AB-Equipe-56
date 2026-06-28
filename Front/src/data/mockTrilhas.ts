export type Questionario = {
  pergunta: string
  opcoes: string[]
  resposta_correta: number
}

export type Modulo = {
  modulo_id: string
  ordem: number
  titulo: string
  tipo: 'video' | 'artigo'
  url_conteudo: string
  concluido: boolean
  questionario: Questionario[]
}

export type Trilha = {
  trilha_id: string
  titulo: string
  categoria: string
  obrigatoria: boolean
  badge_recompensa: string
  tempo_estimado_minutos: number
  progresso: number
  modulos: Modulo[]
}

export const trilhasMock: Trilha[] = [
  {
    trilha_id: 'trilha-vies-01',
    titulo: 'Recrutamento Sem Viés',
    categoria: 'Core RH',
    obrigatoria: true,
    badge_recompensa: 'Certificado Anti-Viés Nível 1',
    tempo_estimado_minutos: 120,
    progresso: 40,
    modulos: [
      {
        modulo_id: 'mod-1',
        ordem: 1,
        titulo: 'O que são Vieses Inconscientes?',
        tipo: 'video',
        url_conteudo: 'https://youtube.com/embed/exemplo1',
        concluido: true,
        questionario: [
          {
            pergunta: 'O que é um viés inconsciente?',
            opcoes: ['Uma escolha racional', 'Um julgamento automático', 'Uma decisão consciente'],
            resposta_correta: 1,
          },
          {
            pergunta: 'Qual consequência pode vir de um viés inconsciente?',
            opcoes: ['Decisões mais justas', 'Julgamentos distorcidos', 'Maior clareza'],
            resposta_correta: 1,
          },
          {
            pergunta: 'Como podemos reduzir o impacto de vieses?',
            opcoes: ['Com critérios objetivos', 'Com ideias aleatórias', 'Sem reflexão'],
            resposta_correta: 0,
          },
        ],
      },
      {
        modulo_id: 'mod-2',
        ordem: 2,
        titulo: 'Como blindar a triagem de currículos',
        tipo: 'artigo',
        url_conteudo: 'text_mock_markdown_content',
        concluido: false,
        questionario: [
          {
            pergunta: 'Qual prática ajuda a reduzir viés na triagem?',
            opcoes: ['Analisar nomes', 'Usar critérios objetivos', 'Ignorar experiências'],
            resposta_correta: 1,
          },
          {
            pergunta: 'O que é mais recomendável em uma triagem?',
            opcoes: ['Usar critérios claros', 'Priorizar aparência', 'Ignorar currículo'],
            resposta_correta: 0,
          },
          {
            pergunta: 'Qual resultado é esperado com critérios objetivos?',
            opcoes: ['Mais equidade', 'Mais preconceito', 'Mais improviso'],
            resposta_correta: 0,
          },
        ],
      },
    ],
  },
  {
    trilha_id: 'trilha-inclusao-02',
    titulo: 'Cultura Inclusiva no Trabalho',
    categoria: 'Inicie por aqui',
    obrigatoria: false,
    badge_recompensa: 'Selo Cultura Inclusiva',
    tempo_estimado_minutos: 90,
    progresso: 20,
    modulos: [
      {
        modulo_id: 'mod-3',
        ordem: 1,
        titulo: 'Práticas de inclusão diária',
        tipo: 'video',
        url_conteudo: 'https://youtube.com/embed/exemplo2',
        concluido: false,
        questionario: [
          {
            pergunta: 'Qual atitude promove inclusão?',
            opcoes: ['Evitar diálogo', 'Ouvir e respeitar', 'Ignorar diferenças'],
            resposta_correta: 1,
          },
          {
            pergunta: 'O que fortalece o ambiente inclusivo?',
            opcoes: ['Respeito e escuta', 'Exclusão', 'Julgamentos rápidos'],
            resposta_correta: 0,
          },
          {
            pergunta: 'Qual comportamento ajuda na inclusão?',
            opcoes: ['Evitar diferenças', 'Reconhecer pluralidade', 'Isolar pessoas'],
            resposta_correta: 1,
          },
        ],
      },
    ],
  },
  {
    trilha_id: 'trilha-diversidade-03',
    titulo: 'Mitigação de Viés',
    categoria: 'Mitigação de Viés',
    obrigatoria: true,
    badge_recompensa: 'Badge Mitigação de Viés',
    tempo_estimado_minutos: 60,
    progresso: 75,
    modulos: [
      {
        modulo_id: 'mod-4',
        ordem: 1,
        titulo: 'Identificando vieses em entrevistas',
        tipo: 'artigo',
        url_conteudo: 'text_mock_markdown_content',
        concluido: true,
        questionario: [
          {
            pergunta: 'O que ajuda a reduzir viés em entrevistas?',
            opcoes: ['Critérios padronizados', 'Preferência pessoal', 'Julgamento rápido'],
            resposta_correta: 0,
          },
          {
            pergunta: 'Qual prática melhora a justiça nas entrevistas?',
            opcoes: ['Perguntas iguais para todos', 'Perguntas diferentes', 'Avaliações intuitivas'],
            resposta_correta: 0,
          },
          {
            pergunta: 'O que é importante durante a avaliação?',
            opcoes: ['Basear-se em evidências', 'Ignorar critérios', 'Seguir impressão inicial'],
            resposta_correta: 0,
          },
        ],
      },
    ],
  },
]
