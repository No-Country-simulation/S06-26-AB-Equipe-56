export type Modulo = {
  modulo_id: string
  ordem: number
  titulo: string
  tipo: 'video' | 'artigo'
  url_conteudo: string
  concluido: boolean
}

export type Trilha = {
  trilha_id: string
  titulo: string
  categoria: string
  obrigatoria: boolean
  badge_recompensa: string
  tempo_estimado_minutos: number
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
    modulos: [
      {
        modulo_id: 'mod-1',
        ordem: 1,
        titulo: 'O que são Vieses Inconscientes?',
        tipo: 'video',
        url_conteudo: 'https://youtube.com/embed/exemplo1',
        concluido: true,
      },
      {
        modulo_id: 'mod-2',
        ordem: 2,
        titulo: 'Como blindar a triagem de currículos',
        tipo: 'artigo',
        url_conteudo: 'text_mock_markdown_content',
        concluido: false,
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
    modulos: [
      {
        modulo_id: 'mod-3',
        ordem: 1,
        titulo: 'Práticas de inclusão diária',
        tipo: 'video',
        url_conteudo: 'https://youtube.com/embed/exemplo2',
        concluido: false,
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
    modulos: [
      {
        modulo_id: 'mod-4',
        ordem: 1,
        titulo: 'Identificando vieses em entrevistas',
        tipo: 'artigo',
        url_conteudo: 'text_mock_markdown_content',
        concluido: true,
      },
    ],
  },
]
