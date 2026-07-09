const { Client } = require('pg');
require('dotenv').config();

const data = [
  {
    trilha_id: 1,
    modulo: {
      nome: 'Identificação e Mitigação de Vieses Inconscientes',
      descricao: `--- GUIA DE ESTUDOS COMPLETO ---
1. O QUE SÃO VIESES INCONSCIENTES?
Vieses inconscientes são atalhos mentais baseados em estereótipos, experiências passadas e referências culturais acumuladas ao longo da vida. O cérebro humano processa cerca de 11 milhões de informações por segundo, mas nossa mente consciente consegue processar apenas cerca de 40. Para lidar com essa sobrecarga, o cérebro automatiza decisões. No entanto, no ambiente corporativo, e em especial nos processos seletivos, esses atalhos geram exclusões sistemáticas de candidatos sub-representados.

2. OS PRINCIPAIS VIESES NO RECRUTAMENTO
• Viés de Afinidade: É a tendência natural de nos sentirmos atraídos e favorecermos pessoas que se parecem conosco, compartilham de hobbies similares, estudaram nas mesmas universidades ou residem na mesma região. Isso cria equipes homogêneas ("clones corporativos") e sabota a diversidade.
• Efeito Halo: Ocorre quando um único aspecto positivo do candidato (como ter trabalhado em uma grande empresa de tecnologia de grife) faz o entrevistador generalizar e assumir que o candidato é excelente em todas as outras competências não testadas.
• Efeito Horn: O oposto do Halo. Uma característica negativa isolada (como um atraso de 5 minutos devido a problemas no trânsito ou um deslize menor na fala) cria uma percepção desfavorável absoluta, fazendo o recrutador ignorar competências técnicas excepcionais apresentadas no currículo.
• Viés de Confirmação: A tendência de formular uma hipótese inicial sobre o candidato nos primeiros segundos e, em seguida, conduzir toda a entrevista apenas buscando perguntas que confirmem essa crença, desconsiderando evidências contrárias.

3. ESTRATÉGIAS PRÁTICAS DE MITIGAÇÃO
• Recrutamento às Cegas: Ocultar dados pessoais de identificação nos currículos (nome, foto, gênero, idade, universidade) garante que a triagem inicial seja focada 100% nas habilidades técnicas necessárias para a vaga.
• Entrevistas Estruturadas: Formular um roteiro fixo de perguntas baseadas em competências para todos os candidatos. Dessa forma, a avaliação torna-se equitativa e baseada em uma régua objetiva predefinida.
• Comitês Diversos: Envolver múltiplos avaliadores de origens e áreas distintas na decisão final de contratação. Isso neutraliza os vieses de afinidade individuais e enriquece a análise.

Fonte bibliográfica: Google L&D Tools & Harvard Implicit Association Test (IAT).`,
      conteudo_url: 'https://www.youtube.com/embed/HFNVR_Wy-d8',
      duracao_minutos: 15,
      ordem: 1
    },
    questionario: {
      nome: 'Avaliação de Vieses Inconscientes',
      nota_minima_aprovacao: 70.00,
      tentativas_permitidas: 3,
      questoes: [
        {
          enunciado: 'O que caracteriza o "Viés de Afinidade" no recrutamento e seleção?',
          ordem: 1,
          alternativas: [
            { texto: 'Avaliar o candidato apenas com base em uma única falha grave identificada em seu currículo.', correta: false },
            { texto: 'A tendência inconsciente de simpatizar e favorecer candidatos que compartilham de semelhanças conosco (como origem, interesses pessoais ou estilo de vida).', correta: true },
            { texto: 'Avaliar os candidatos de forma puramente técnica, desconsiderando aspectos comportamentais.', correta: false },
            { texto: 'Procurar apenas informações que confirmem nossa primeira impressão inicial sobre o candidato.', correta: false }
          ]
        },
        {
          enunciado: 'Qual das seguintes ações é uma técnica eficaz e reconhecida para mitigar vieses inconscientes na triagem inicial de currículos?',
          ordem: 2,
          alternativas: [
            { texto: 'Solicitar fotos e informações pessoais de todos os candidatos logo no início do processo.', correta: false },
            { texto: 'Realizar a triagem de forma subjetiva e rápida, confiando plenamente no "feeling" inicial.', correta: false },
            { texto: 'Utilizar o recrutamento às cegas (ocultando nome, gênero, idade, foto e universidade) para focar estritamente nas competências profissionais.', correta: true },
            { texto: 'Entrevistar apenas pessoas indicadas pela mesma instituição de ensino em que você se formou.', correta: false }
          ]
        },
        {
          enunciado: 'Qual é o principal objetivo de se utilizar "Entrevistas Estruturadas" em um processo seletivo?',
          ordem: 3,
          alternativas: [
            { texto: 'Permitir que o recrutador altere as perguntas livremente de acordo com a simpatia pelo candidato.', correta: false },
            { texto: 'Garantir que todos os candidatos respondam às mesmas perguntas sob os mesmos critérios objetivos de avaliação, reduzindo julgamentos subjetivos e comparando respostas com equidade.', correta: true },
            { texto: 'Apenas acelerar o tempo total do processo seletivo e reduzir o envolvimento dos gestores.', correta: false },
            { texto: 'Eliminar a necessidade de fazer testes técnicos ou avaliações de código.', correta: false }
          ]
        }
      ]
    }
  },
  {
    trilha_id: 2,
    modulo: {
      nome: 'Acessibilidade e Boas Práticas na Contratação PCD',
      descricao: `--- GUIA DE ESTUDOS COMPLETO ---
1. A LEGISLAÇÃO E O CONTEXTO SOCIAL (LBI)
A Lei Brasileira de Inclusão da Pessoa com Deficiência (Lei nº 13.146/2015), também conhecida como LBI, assegura e promove, em condições de igualdade, o exercício dos direitos e das liberdades fundamentais por pessoas com deficiência, visando à sua inclusão social e cidadania. O mercado corporativo não deve olhar para a contratação PCD apenas como o cumprimento da "Lei de Cotas" (Lei nº 8.213/91), mas sim como um vetor de inovação e valor humano.

2. ADAPTAÇÃO RAZOÁVEL: O QUE É?
Refere-se às modificações e ajustes necessários e adequados que não acarretem ônus desproporcional ou indevido, requeridos em cada caso particular, para assegurar que a pessoa com deficiência possa desfrutar ou exercitar, em igualdade de oportunidades com as demais pessoas, todos os direitos humanos e liberdades fundamentais. Exemplos práticos incluem:
• Softwares de leitura de tela para pessoas cegas (como NVDA ou JAWS).
• Mesas com regulagem de altura para cadeirantes.
• Flexibilidade de horário para consultas e tratamentos médicos de rotina.
• Comunicação visual e direta para pessoas neurodivergentes.

3. CONDUZINDO ENTREVISTAS ACESSÍVEIS E INCLUSIVAS
• Candidatos Surdos com Intérpretes de Libras: Lembre-se sempre de olhar e falar diretamente com o candidato surdo, não com o intérprete. O intérprete é um facilitador de comunicação, mas o entrevistado é o candidato. Fale em tom e velocidade normais.
• Candidatos com Deficiência Visual: Ao guiar o candidato, ofereça seu cotovelo para que ele segure, em vez de empurrá-lo ou puxá-lo pela mão. Descreva o ambiente se necessário e seja verbalmente específico (evite termos como "ali" ou "lá").
• Candidatos Neurodivergentes (Autismo, TDAH): Foque em avaliações objetivas baseadas em simulações técnicas reais. Evite forçar contato visual prolongado ou avaliar a linguagem corporal subjetiva, que podem não refletir o potencial profissional da pessoa.

Fonte bibliográfica: Lei Brasileira de Inclusão (LBI) & Guia de Acessibilidade da Rede de Ação Política pela Sustentabilidade (RAPS).`,
      conteudo_url: 'https://www.youtube.com/embed/WvNfbnlAvJ8',
      duracao_minutos: 20,
      ordem: 1
    },
    questionario: {
      nome: 'Avaliação de Acessibilidade e Inclusão PCD',
      nota_minima_aprovacao: 70.00,
      tentativas_permitidas: 3,
      questoes: [
        {
          enunciado: 'Segundo a Lei Brasileira de Inclusão (LBI), o que define a "adaptação razoável"?',
          ordem: 1,
          alternativas: [
            { texto: 'Modificações e ajustes necessários que não acarretem ônus desproporcional, com o fim de garantir que pessoas com deficiência gozem de igualdade de oportunidades no trabalho.', correta: true },
            { texto: 'A obrigatoriedade de contratar qualquer candidato PCD que se inscrever, independentemente do alinhamento ao cargo.', correta: false },
            { texto: 'A exigência de que a própria pessoa com deficiência arque com os custos de adaptação do seu posto de trabalho.', correta: false },
            { texto: 'Um acordo informal para flexibilizar as metas e horários de forma permanente sem adaptações físicas.', correta: false }
          ]
        },
        {
          enunciado: 'Como o recrutador deve agir ao entrevistar uma pessoa surda que utiliza a Língua Brasileira de Sinais (Libras) com o apoio de um intérprete?',
          ordem: 2,
          alternativas: [
            { texto: 'Falar diretamente com o intérprete, evitando olhar para o candidato para não o deixar constrangido.', correta: false },
            { texto: 'Direcionar a fala e o olhar diretamente ao candidato surdo, mantendo o intérprete como suporte de comunicação e falando em ritmo normal.', correta: true },
            { texto: 'Falar extremamente alto e pausadamente, gesticulando de forma exagerada para forçar o entendimento.', correta: false },
            { texto: 'Substituir a entrevista falada por um teste escrito longo, sem suporte de Libras.', correta: false }
          ]
        },
        {
          enunciado: 'Qual é a melhor prática recomendada para avaliar candidatos neurodivergentes (como autistas) durante a entrevista?',
          ordem: 3,
          alternativas: [
            { texto: 'Utilizar perguntas metafóricas e abstratas para avaliar a flexibilidade cognitiva e criatividade.', correta: false },
            { texto: 'Evitar forçar contato visual direto e focar em perguntas claras, diretas, baseadas em fatos e experiências concretas de trabalho.', correta: true },
            { texto: 'Excluir candidatos neurodivergentes de dinâmicas coletivas sem oferecer uma alternativa de avaliação individual.', correta: false },
            { texto: 'Eliminar as fases de avaliação técnica e basear a decisão apenas no encaixe social.', correta: false }
          ]
        }
      ]
    }
  },
  {
    trilha_id: 3,
    modulo: {
      nome: 'Equidade Racial e Ações Afirmativas nas Organizações',
      descricao: `--- GUIA DE ESTUDOS COMPLETO ---
1. RACISMO ESTRUTURAL E A DESIGUALDADE NO MERCADO
O racismo estrutural é a cristalização de desigualdades raciais históricas na estrutura política, jurídica, econômica e cultural de uma sociedade. Isso se reflete diretamente nas empresas: profissionais negros e indígenas ocupam proporções muito menores em cargos de gerência e diretoria executiva, mesmo quando possuem qualificações equivalentes. Para combater isso, as empresas precisam migrar de uma postura meramente passiva para uma postura antirracista ativa.

2. IGUALDADE VS. EQUIDADE
• Igualdade significa tratar todos da mesma forma, partindo do pressuposto de que todos começaram do mesmo ponto e possuem as mesmas ferramentas.
• Equidade consiste em reconhecer que diferentes grupos partem de posições históricas e sociais desiguais. Portanto, é necessário distribuir recursos, suportes e oportunidades de maneira personalizada para que todos tenham condições reais de atingir o mesmo potencial.
Ações afirmativas (como vagas exclusivas para negros e indígenas ou programas de aceleração de carreira) não são "privilégios", mas sim ferramentas de equidade para corrigir distorções históricas.

3. IMPLEMENTANDO O SOURCING AFIRMATIVO
• Divulgação Direcionada: Anunciar oportunidades em canais específicos de coletivos negros, conselhos comunitários, universidades periféricas e plataformas focadas em diversidade (como a EmpregueAfro ou a Indique Uma Preta).
• Revisão de Requisitos Excludentes: Avaliar se requisitos tradicionais como "inglês fluente" ou "diploma de universidade de elite" são estritamente necessários para a execução diária do trabalho. Muitas vezes, esses filtros eliminam candidatos negros qualificados que não tiveram acesso a essas oportunidades na infância.
• Programas de Mentoria e Retenção: Garantir que, após a contratação, existam grupos de afinidade e programas de mentoria estruturados para apoiar o desenvolvimento e a retenção desses talentos.

Fonte bibliográfica: Instituto Ethos de Empresas e Responsabilidade Social & "Pequeno Manual Antirracista" de Djamila Ribeiro.`,
      conteudo_url: 'https://www.youtube.com/embed/PD4Ew5DIGrU',
      duracao_minutos: 18,
      ordem: 1
    },
    questionario: {
      nome: 'Avaliação de Equidade Racial corporativa',
      nota_minima_aprovacao: 70.00,
      tentativas_permitidas: 3,
      questoes: [
        {
          enunciado: 'Qual a diferença fundamental entre "Igualdade" e "Equidade" no contexto de diversidade racial nas organizações?',
          ordem: 1,
          alternativas: [
            { texto: 'Igualdade foca em tratar a todos de forma idêntica dando as mesmas ferramentas; Equidade reconhece desvantagens históricas e distribui recursos de acordo com as necessidades específicas para garantir igualdade de oportunidades reais.', correta: true },
            { texto: 'São termos equivalentes sem diferença conceitual ou prática.', correta: false },
            { texto: 'Igualdade refere-se a quotas obrigatórias, enquanto Equidade significa contratação baseada apenas em indicações.', correta: false },
            { texto: 'Equidade visa dar vantagens para grupos majoritários, equilibrando a competitividade.', correta: false }
          ]
        },
        {
          enunciado: 'O que significa o concept de "Racismo Estrutural"?',
          ordem: 2,
          alternativas: [
            { texto: 'Uma atitude discriminatória e consciente cometida pontualmente por um indivíduo isolado.', correta: false },
            { texto: 'O conjunto de práticas, hábitos, situações e relações sociais enraizados na cultura, economia e política que reproduzem a desigualdade e exclusão racial de forma sistêmica.', correta: true },
            { texto: 'O preconceito racial que ocorre apenas na hierarquia ou estrutura de cargos executivos das empresas.', correta: false },
            { texto: 'Um tipo de discriminação já completamente erradicado pela legislação brasileira.', correta: false }
          ]
        },
        {
          enunciado: 'Como uma empresa pode estruturar ações de "Sourcing Afirmativo" eficientes?',
          ordem: 3,
          alternativas: [
            { texto: 'Fazer divulgações apenas nos portais corporativos tradicionais voltados a perfis executivos tradicionais.', correta: false },
            { texto: 'Estabelecer parcerias com coletivos negros, universidades públicas/periféricas e plataformas de fomento a talentos negros e indígenas, divulgando ativamente as oportunidades nesses ecossistemas.', correta: true },
            { texto: 'Desconsiderar totalmente as habilidades técnicas exigidas pelo cargo nas contratações afirmativas.', correta: false },
            { texto: 'Substituir entrevistas por sorteios de vagas para acelerar a contratação.', correta: false }
          ]
        }
      ]
    }
  },
  {
    trilha_id: 4,
    modulo: {
      nome: 'Desconstruindo Vieses de Gênero na Tecnologia',
      descricao: `--- GUIA DE ESTUDOS COMPLETO ---
1. MULHERES NA TECNOLOGIA: O CONTEXTO HISTÓRICO
Embora as mulheres tenham sido pioneiras na computação (como Ada Lovelace, a primeira programadora do mundo, e Grace Hopper, criadora da linguagem COBOL), a área de tecnologia sofreu um processo de masculinização cultural a partir da década de 1980. Hoje, as mulheres representam menos de 25% dos profissionais em cargos técnicos de STEM (Ciência, Tecnologia, Engenharia e Matemática) e enfrentam barreiras que vão desde a atração até a promoção para cargos seniores.

2. NEUTRALIDADE E REDAÇÃO DE VAGAS
Estudos de linguística mostram que anúncios de vagas contendo termos excessivamente competitivos ou associados a estereótipos masculinos de dominação (como "ninja", "guru", "predador", "matador", "competitividade agressiva") fazem com que mulheres qualificadas desistam de se candidatar. Para atrair talentos femininos, as descrições de vagas devem focar em:
• Linguagem colaborativa e orientada ao aprendizado mútuo.
• Foco em resultados esperados, em vez de uma lista interminável de pré-requisitos flexíveis.
• Ênfase clara em flexibilidade, apoio à parentalidade e equilíbrio de vida.

3. MITIGANDO O VIÉS NAS ENTREVISTAS TÉCNICAS E O "TETO DE VIDRO"
• Testes de Código Cego: Avaliar o código entregue pelo candidato sem saber seu nome ou gênero. Isso garante que a nota técnica seja baseada estritamente na qualidade da solução e na lógica de programação.
• Entrevistas Padronizadas: Evitar perguntas pessoais e intrusivas sobre planejamento familiar, casamento ou planos de gravidez. Essas perguntas são ilegais e refletem discriminação de gênero.
• O Teto de Vidro (Glass Ceiling): Refere-se à barreira invisível que impede que mulheres qualificadas avancem para posições de alta liderança (C-Level, Conselhos). Para quebrá-lo, as empresas devem instituir planos de carreira claros, com metas de representatividade feminina no topo.

Fonte bibliográfica: NCWIT (National Center for Women & Information Technology) & McKinsey & Company "Women in the Workplace".`,
      conteudo_url: 'https://www.youtube.com/embed/aZtmTpTPUwU',
      duracao_minutos: 15,
      ordem: 1
    },
    questionario: {
      nome: 'Avaliação de Equidade de Gênero em Tech',
      nota_minima_aprovacao: 70.00,
      tentativas_permitidas: 3,
      questoes: [
        {
          enunciado: 'Como a linguagem de uma descrição de vaga pode influenciar a atração de candidatas mulheres?',
          ordem: 1,
          alternativas: [
            { texto: 'O uso excessivo de termos altamente competitivos ou masculinizados (como "ninja", "predador", "matador") afasta candidatas qualificadas, enquanto descrições equilibradas atraem mais talentos femininos.', correta: true },
            { texto: 'A linguagem é neutra por definição e não tem qualquer impacto sobre a decisão de candidatura.', correta: false },
            { texto: 'Descrições com maior número de tecnologias requeridas atraem exclusivamente mulheres.', correta: false },
            { texto: 'Especificar faixas salariais atrai apenas perfis masculinos.', correta: false }
          ]
        },
        {
          enunciado: 'Qual é uma prática recomendada para evitar vieses de gênero em testes técnicos de código?',
          ordem: 2,
          alternativas: [
            { texto: 'Aplicar testes mais simplificados para candidatas mulheres para acelerar a aprovação.', correta: false },
            { texto: 'Utilizar avaliações técnicas anônimas (code challenges assíncronos avaliados de forma cega por rubricas padronizadas).', correta: true },
            { texto: 'Permitir que o avaliador faça perguntas sobre planos pessoais de maternidade ou casamento durante o teste.', correta: false },
            { texto: 'Substituir avaliações de código por perguntas teóricas subjetivas.', correta: false }
          ]
        },
        {
          enunciado: 'O que representa o termo "Teto de Vidro" (Glass Ceiling) no mercado corporativo?',
          ordem: 3,
          alternativas: [
            { texto: 'A barreira invisível, sustentada por preconceitos sistêmicos, que bloqueia a ascensão de mulheres qualificadas a cargos de alta liderança e diretoria executiva.', correta: true },
            { texto: 'A facilidade com que as minorias conseguem subir na hierarquia de startups de tecnologia.', correta: false },
            { texto: 'Um tipo de benefício voltado para flexibilização de home office concedido a gestores.', correta: false },
            { texto: 'A fragilidade financeira de empresas geridas por conselhos predominantemente femininos.', correta: false }
          ]
        }
      ]
    }
  },
  {
    trilha_id: 5,
    modulo: {
      nome: 'Cultura Inclusiva e Respeito à Diversidade LGBTQIA+',
      descricao: `--- GUIA DE ESTUDOS COMPLETO ---
1. TERMINOLOGIA E DIVERSIDADE DE IDENTIDADE
Criar um ambiente acolhedor para pessoas LGBTQIA+ exige a compreensão de termos básicos que separam orientação afetivo-sexual de identidade de gênero:
• Orientação Sexual: Refere-se a quem a pessoa sente atração física e afetiva (ex: lésbica, gay, bissexual, assexual, pansexual).
• Identidade de Gênero: Refere-se a como a pessoa se identifica internamente (ex: cisgênero, transgênero, não-binário).
Respeitar essas definições é o primeiro passo para uma comunicação inclusiva.

2. O RESPEITO AO NOME SOCIAL E PRONOMES
Para pessoas transgêneras (travestis, homens e mulheres trans) e não-binárias, o respeito ao Nome Social e aos pronomes de escolha é um direito fundamental. No recrutamento e seleção:
• Use sempre o Nome Social e os pronomes corretos em todas as etapas de contato, entrevistas e dinâmicas de grupo.
• O nome civil (que consta no registro de nascimento e pode ainda não ter sido retificado) deve ser solicitado apenas no momento da contratação formal para emissão do contrato de trabalho e cadastro de benefícios, permanecendo restrito ao departamento de Recursos Humanos.
• Apresentar-se com seus pronomes (ex: "Olá, sou Maria, pronomes ela/dela") demonstra abertura e valida a identidade do candidato sem forçá-lo a passar por constrangimentos.

3. CRIANDO ESPAÇOS CORPORATIVOS SEGUROS
• Banheiros Inclusivos: Garantir o direito de uso do banheiro correspondente à identidade de gênero com a qual a pessoa se identifica.
• Canais de Denúncia: Implementar canais confidenciais e eficazes para relatar condutas transfóbicas, homofóbicas ou piadas discriminatórias, com consequências reais descritas no código de conduta da empresa.
• Benefícios Equitativos: Oferecer benefícios estendidos para casais do mesmo sexo (como plano de saúde, licença parental e auxílio-creche).

Fonte bibliográfica: Fórum de Empresas e Direitos LGBTI+ & Manual de Comunicação Inclusiva do Programa das Nações Unidas para o Desenvolvimento (PNUD).`,
      conteudo_url: 'https://www.youtube.com/embed/WZ8JINtvAJc',
      duracao_minutos: 12,
      ordem: 1
    },
    questionario: {
      nome: 'Avaliação de Inclusão LGBTQIA+',
      nota_minima_aprovacao: 70.00,
      tentativas_permitidas: 3,
      questoes: [
        {
          enunciado: 'Qual a conduta correta em relação ao "Nome Social" de um candidato transgênero no processo seletivo?',
          ordem: 1,
          alternativas: [
            { texto: 'Utilizar exclusivamente o nome de registro civil até que o candidato comprove a retificação oficial de documentos.', correta: false },
            { texto: 'Utilizar e respeitar o Nome Social e pronomes corretos do candidato em todas as comunicações, mantendo o nome civil apenas sob sigilo absoluto em trâmites legais e de admissão.', correta: true },
            { texto: 'Perguntar na entrevista sobre cirurgias ou detalhes médicos de transição para preenchimento de perfil.', correta: false },
            { texto: 'Tratar o Nome Social como um apelido informal opcional, a critério do entrevistador.', correta: false }
          ]
        },
        {
          enunciado: 'Qual atitude promove uma comunicação respeitosa e inclusiva com candidatos LGBTQIA+?',
          ordem: 2,
          alternativas: [
            { texto: 'Apresentar-se com seus próprios pronomes (ex: "Sou Fulano, pronomes ele/dele") ao iniciar a entrevista, gerando um ambiente de segurança para autoidentificação.', correta: true },
            { texto: 'Perguntar publicamente a orientação sexual dos candidatos para atingir indicadores ESG de forma mais rápida.', correta: false },
            { texto: 'Restringir a contratação de pessoas trans a cargos que não lidam diretamente com clientes ou fornecedores.', correta: false },
            { texto: 'Fazer piadas para descontrair a entrevista, desconsiderando pronomes informados.', correta: false }
          ]
        },
        {
          enunciado: 'O que engloba a sigla "LGBTQIA+" e qual o principal objetivo de sua representatividade no ambiente corporativo?',
          ordem: 3,
          alternativas: [
            { texto: 'Acolher e respeitar pessoas com diferentes orientações sexuais e identidades de gênero, garantindo igualdade de direitos e criando ambientes livres de preconceito e discriminação.', correta: true },
            { texto: 'Um programa de benefícios internacionais voltado para colaboradores solteiros.', correta: false },
            { texto: 'Um conjunto de regras de comportamento social restritas à equipe de marketing.', correta: false },
            { texto: 'Uma regulamentação sindical aplicável apenas em startups.', correta: false }
          ]
        }
      ]
    }
  }
];

async function seedData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Conectado ao Neon PostgreSQL. Iniciando transação de seed...');

    await client.query('BEGIN');

    // 1. Clear old progress, responses and results to avoid foreign key errors
    console.log('Limpando dados antigos relacionados a treinamentos (respostas, resultados, progresso)...');
    await client.query('DELETE FROM "respostasrecrutador"');
    await client.query('DELETE FROM "resultadosquestionario"');
    await client.query('DELETE FROM "recrutadores_modulos"');
    await client.query('DELETE FROM "recrutadores_trilhas"');

    // 2. Clear old module/quiz definitions
    console.log('Limpando módulos e questionários antigos...');
    await client.query('DELETE FROM "alternativasquestao"');
    await client.query('DELETE FROM "questoes"');
    await client.query('DELETE FROM "questionarios"');
    await client.query('DELETE FROM "modulos"');

    // 3. Insert real data
    for (const item of data) {
      console.log(`\nInserindo conteúdo para Trilha ID: ${item.trilha_id}...`);

      // Insert Modulo
      const moduloRes = await client.query(
        `INSERT INTO modulos (trilha_id, nome, descricao, conteudo_url, duracao_minutos, ordem)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING modulo_id`,
        [item.trilha_id, item.modulo.nome, item.modulo.descricao, item.modulo.conteudo_url, item.modulo.duracao_minutos, item.modulo.ordem]
      );
      const moduloId = moduloRes.rows[0].modulo_id;
      console.log(`-> Módulo inserido. ID: ${moduloId}`);

      // Insert Questionario
      if (item.questionario) {
        const questRes = await client.query(
          `INSERT INTO questionarios (modulo_id, nome, nota_minima_aprovacao, tentativas_permitidas)
           VALUES ($1, $2, $3, $4)
           RETURNING questionario_id`,
          [moduloId, item.questionario.nome, item.questionario.nota_minima_aprovacao, item.questionario.tentativas_permitidas]
        );
        const questionarioId = questRes.rows[0].questionario_id;
        console.log(`-> Questionário inserido. ID: ${questionarioId}`);

        // Insert Questoes & Alternativas
        for (const q of item.questionario.questoes) {
          const questaoRes = await client.query(
            `INSERT INTO questoes (questionario_id, enunciado, ordem)
             VALUES ($1, $2, $3)
             RETURNING questao_id`,
            [questionarioId, q.enunciado, q.ordem]
          );
          const questaoId = questaoRes.rows[0].questao_id;

          for (const alt of q.alternativas) {
            await client.query(
              `INSERT INTO alternativasquestao (questao_id, texto, correta)
               VALUES ($1, $2, $3)`,
              [questaoId, alt.texto, alt.correta]
            );
          }
        }
        console.log(`-> ${item.questionario.questoes.length} questões e suas alternativas inseridas.`);
      }
    }

    await client.query('COMMIT');
    console.log('\n=============================================');
    console.log('SEED REALIZADO COM SUCESSO!');
    console.log('=============================================');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro durante o seed (Rolled back):', err);
  } finally {
    await client.end();
  }
}

seedData();
