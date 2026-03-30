BEGIN;
DELETE FROM eventos WHERE tipo = 'podcast' AND squad = 'Podcast';

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'A Importância do Networking e Produtividade',
  'Episódio 03 do MackEmpreende Cast com Ariel Quadros.',
  '2022-11-16 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Ariel Quadros","empresa":"","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Rafael Calixto (Scalable) — Sucesso ainda jovem. CRO da Scalable, que captou R$ 20 milhões',
  'Episódio 1 do MackEmpreende Cast com Rafael Calixto.',
  '2023-05-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Rafael Calixto","empresa":"Fundador & CRO — Scalable","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Beatriz Tolezano (TikTok) — O poder do TikTok para o pequeno empreendedor',
  'Episódio 2 do MackEmpreende Cast com Beatriz Tolezano.',
  '2023-06-28 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Beatriz Tolezano","empresa":"Gerente de Marketing SMB — TikTok América Latina","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gabriel Didier (Ambev) — Tudo sobre o Profissional do Futuro',
  'Episódio 3 do MackEmpreende Cast com Gabriel Didier.',
  '2023-08-30 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Gabriel Didier","empresa":"Gerente de Comunicações Externas — Ambev","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gustavo Giglio (Omelete Company) — O mercado de entretenimento e a geração Z',
  'Episódio 4 do MackEmpreende Cast com Gustavo Giglio.',
  '2023-09-06 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Gustavo Giglio","empresa":"Head de Marketing de Relacionamento & Creator Unlock CCXP — Omelete Company","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Alexandre Capella (Mais Mu) (Parte 1) — A vaquinha que revolucionou o mercado fitness',
  'Episódio 5 do MackEmpreende Cast com Alexandre Capella.',
  '2023-09-13 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Alexandre Capella","empresa":"Sócio & Diretor de Operações — Mais Mu","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Alexandre Capella (Mais Mu) (Parte 2) — A vaquinha que revolucionou o mercado fitness',
  'Episódio 6 do MackEmpreende Cast com Alexandre Capella.',
  '2023-10-14 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Alexandre Capella","empresa":"Sócio & Diretor de Operações — Mais Mu","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Eduardo Hauaji (Google) — O Mercado de Startups e a Busca pelo Sucesso',
  'Episódio 7 do MackEmpreende Cast com Eduardo Hauaji.',
  '2023-09-07 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Eduardo Hauaji","empresa":"Google for Startups Cloud Program","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Isabella Scarpelli (Spotify) — O Spotify e a Nova Era do Áudio',
  'Episódio 8 do MackEmpreende Cast com Isabella Scarpelli.',
  '2023-10-20 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Isabella Scarpelli","empresa":"Ela & Client Partner — Spotify","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Veronica Schneider (CNN Brasil) — O Novo Mundo do Conteúdo Digital',
  'Episódio 9 do MackEmpreende Cast com Veronica Schneider.',
  '2023-10-17 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Veronica Schneider","empresa":"Gerente de Estratégia de Conteúdo — CNN Brasil","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Bruno Rohifs (Push) — A história sem filtro da Push Matcha',
  'Episódio 10 do MackEmpreende Cast com Bruno Rohifs.',
  '2023-10-12 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Bruno Rohifs","empresa":"Fundador & CEO — Push Matcha","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Erich Shibata (Cimed) — O Sucesso por Trás do Amarelo Cimed',
  'Episódio 11 do MackEmpreende Cast com Erich Shibata.',
  '2023-10-25 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Erich Shibata","empresa":"Diretor Criativo — Cimed","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Nathália Thomazéli (Bruna Tavares) — Como Empreender no Ramo da Beleza',
  'Episódio 12 do MackEmpreende Cast com Nathália Thomazéli.',
  '2023-11-01 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Nathália Thomazéli","empresa":"Gerente de Comunicação — Bruna Tavares","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Letícia Pavim (Rede Pavim) — A História de Uma Jovem Empreendedora',
  'Episódio 13 do MackEmpreende Cast com Letícia Pavim.',
  '2023-11-08 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Letícia Pavim","empresa":"Trainee Kraft Heinz / Fundadora — Rede Pavim","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Rodrigo Maroja (Daki) — Entregando supermercado em 15 minutos',
  'Episódio 14 do MackEmpreende Cast com Rodrigo Maroja.',
  '2023-11-15 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Rodrigo Maroja","empresa":"Co-fundador — Daki","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Filipe Rocha (Coca-Cola) — Pensou Natal, Pensou Coca!',
  'Episódio 15 do MackEmpreende Cast com Filipe Rocha.',
  '2023-12-20 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Filipe Rocha","empresa":"Gerente de Design — Coca-Cola","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Laura Barros (Wine) — Quando vinho e negócios se encontram',
  'Episódio 16 do MackEmpreende Cast com Laura Barros.',
  '2023-10-04 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Laura Barros","empresa":"Diretora de Marketing — Wine","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Tiago Mavichian (Companhia de Estágios) — Recrutamento e Seleção de A a Z',
  'Episódio 17 do MackEmpreende Cast com Tiago Mavichian.',
  '2024-01-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Tiago Mavichian","empresa":"CEO — Companhia de Estágios","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gustavo Piedade (EdTech Síndria) — Da Stock Car à Y Combinator: Desafios e Aprendizados',
  'Episódio 18 do MackEmpreende Cast com Gustavo Piedade.',
  '2024-01-25 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Gustavo Piedade","empresa":"COO — EdTech Síndria","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Naara Risseto — Como é empreender no mundo da Moda?',
  'Episódio 19 do MackEmpreende Cast com Naara Risseto.',
  '2024-08-27 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Naara Risseto","empresa":"Dona — Naah Store","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Fábio Arten — Afinal, o que é estratégia?',
  'Episódio 20 do MackEmpreende Cast com Fábio Arten.',
  '2024-10-22 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fábio Arten","empresa":"Estrategista / Professor","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Dot Energy — Por trás da primeira bala energética do Brasil',
  'Episódio 21 do MackEmpreende Cast com Fundadores Dot Energy.',
  '2024-10-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fundadores Dot Energy","empresa":"Founders — Dot Energy","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Backstage — As redes sociais como estratégia para construir autoridade no mercado',
  'Episódio 22 do MackEmpreende Cast com Time Backstage.',
  '2024-11-10 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Time Backstage","empresa":"Founders — Backstage","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Flávio Valati — A importância dos relacionamentos no sucesso profissional',
  'Episódio 23 do MackEmpreende Cast com Flávio Valati.',
  '2024-11-27 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Flávio Valati","empresa":"","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Fabiana Quezada — Mentalidade Sistêmica: Transformando o Direito e os Negócios',
  'Episódio 24 do MackEmpreende Cast com Fabiana Quezada.',
  '2024-12-09 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fabiana Quezada","empresa":"Advogada / Empreendedora","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Tarcísio Freitas — Mentalidade de Alto Impacto: Como Pensar Como um Verdadeiro Visionário',
  'Episódio 25 do MackEmpreende Cast com Tarcísio Freitas.',
  '2025-01-20 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Tarcísio Freitas","empresa":"Empreendedor / Visionário","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Lucas Bravo — Como escalar negócios e construir oportunidades',
  'Episódio 26 do MackEmpreende Cast com Lucas Bravo.',
  '2025-02-27 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Lucas Bravo","empresa":"Empreendedor / @studiies.com.br","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Ana Marinho — Empreender com Propósito: A comunidade como estratégia e empoderamento feminino',
  'Episódio 27 do MackEmpreende Cast com Ana Marinho.',
  '2025-04-16 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Ana Marinho","empresa":"Fundadora — Corporate Girls Club","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gabriela Mussallam — Como conciliar sonho e carreira?',
  'Episódio 28 do MackEmpreende Cast com Gabriela Mussallam.',
  '2025-05-09 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Gabriela Mussallam","empresa":"Fundadora — Mussa Sweets","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Noway — Como inovar e crescer em mercados tradicionais?',
  'Episódio 29 do MackEmpreende Cast com Fundadores Noway Drink.',
  '2025-05-15 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fundadores Noway Drink","empresa":"Founders — Noway Drink","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Alibis — Transformando cultura e identidade em um case de sucesso',
  'Episódio 30 do MackEmpreende Cast com Fundadores Alibis.',
  '2025-05-22 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fundadores Alibis","empresa":"Founders — Alibis","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Bordando Personalidades: A história por trás da Koelles.',
  'Episódio 31 do MackEmpreende Cast com Fundadores Koelles.',
  '2025-06-05 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fundadores Koelles","empresa":"Founders — Koelles","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Daniel Chalfon — Além do pitch: descomplicando o universo do Venture Capital',
  'Episódio 32 do MackEmpreende Cast com Daniel Chalfon.',
  '2025-06-13 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Daniel Chalfon","empresa":"Sócio — Astella","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Marcela Lahoz — Entre posts, perrengues e waffles: Autenticidade, influência e os bastidores da jornada da Tchela',
  'Episódio 33 do MackEmpreende Cast com Marcela Lahoz (@tchela).',
  '2025-06-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Marcela Lahoz (@tchela)","empresa":"Criadora de conteúdo / Time comercial — The News","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Lucas Callazzo — Como transformar rotina em performance e oportunidades em resultado',
  'Episódio 34 do MackEmpreende Cast com Lucas Callazzo.',
  '2025-07-08 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Lucas Callazzo","empresa":"Especialista em alocação de fundos no XP Inc. / Colunista InfoMoney / Host Stock Pickers","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gaio AI — Transformando seguidores em clientes de forma inteligente',
  'Episódio 35 do MackEmpreende Cast com Time Gaio AI.',
  '2025-07-31 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Time Gaio AI","empresa":"Founders — Gaio AI","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Reinaldo Passadori — o poder da comunicação',
  'Episódio 36 do MackEmpreende Cast com Reinaldo Passadori.',
  '2025-08-26 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Reinaldo Passadori","empresa":"Fundador — Passadori Comunicação","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Reinaldo Domingos — Como Transformar Sua Vida Financeira',
  'Episódio 37 do MackEmpreende Cast com Reinaldo Domingos.',
  '2025-08-26 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Reinaldo Domingos","empresa":"Criador do Método DSOP","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Papo Mackempreende (interno)',
  'Episódio 38 do MackEmpreende Cast com Membros da Liga MackEmpreende.',
  '2025-09-16 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Membros da Liga MackEmpreende","empresa":"Liga MackEmpreende","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Sterna Café — Do sonho à maior franquia de café',
  'Episódio 39 do MackEmpreende Cast com Deiverson Migliatti.',
  '2025-11-12 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Deiverson Migliatti","empresa":"Fundador — Sterna Café","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Chilli Beans — A mente por trás das melhores propagandas',
  'Episódio 40 do MackEmpreende Cast com Zé Caporrino.',
  '2025-11-19 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Zé Caporrino","empresa":"Head de Criação — Chilli Beans","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Samax — Gaste menos com a nuvem',
  'Episódio 41 do MackEmpreende Cast com Rafael Calixto.',
  '2025-11-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Rafael Calixto","empresa":"Co-fundador — Scalable / Samax","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Smoov — a marca que dominou a gen z',
  'Episódio 42 do MackEmpreende Cast com Leonardo Quintão.',
  '2025-12-05 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Leonardo Quintão","empresa":"Fundador — Smoov","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Fernando Souza — Grupo Fit',
  'Episódio 43 do MackEmpreende Cast com Fernando Souza.',
  '2026-01-06 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Fernando Souza","empresa":"CEO — Grupo FIT","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Harry Carqueira — Founder com Exit de Sucesso',
  'Episódio 44 do MackEmpreende Cast com Harry Carqueira.',
  '2026-01-05 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Harry Carqueira","empresa":"Co-fundador — Delend / Professor Endeavor","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Cafellow revolucionou o Agro',
  'Episódio 45 do MackEmpreende Cast com Paula Veloso.',
  '2026-01-08 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Paula Veloso","empresa":"Fundadora — Cafellow","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Gallina: Construindo marcas e comunidades',
  'Episódio 46 do MackEmpreende Cast com Guilherme Gallina.',
  '2026-01-16 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Guilherme Gallina","empresa":"Líder Red Bull / Sócio — Dates Snacks","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Luciana Passadori: Autoliderança Feminina',
  'Episódio 47 do MackEmpreende Cast com Luciana Passadori.',
  '2026-01-22 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Luciana Passadori","empresa":"Co-fundadora Alma / IVG — Elas por Elas","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Conheça o Hub de Inovação do SPFC',
  'Episódio 48 do MackEmpreende Cast com José Oliver.',
  '2026-02-03 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"José Oliver","empresa":"Head de Inovação e Novos Negócios — São Paulo FC","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'Universo de Entidades Estudantis do Mackenzie',
  'Episódio 49 do MackEmpreende Cast com Mack Finanças e Mack Ventures.',
  '2026-02-24 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Mack Finanças","empresa":"Líderes de entidades estudantis do Mackenzie","is_backup":false},{"nome":"Mack Ventures","empresa":"Líderes de entidades estudantis do Mackenzie","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  '#01 - Do Mercado Financeiro ao Empreendedorismo',
  'Episódio 50 do MackEmpreende Cast com Bruno Katayama.',
  '2026-02-27 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Bruno Katayama","empresa":"Ex-bancos JP Morgan / Dono de restaurantes","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  'The Founders — Como Criar Valor Real',
  'Episódio 51 do MackEmpreende Cast com Matteo Custo.',
  '2026-12-12 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[{"nome":"Matteo Custo","empresa":"Analista M&A / Co-fundador — The Founders","is_backup":false}],"info_podcast":true}'::jsonb
);

INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (
  '',
  'Episódio 52 do MackEmpreende Cast com .',
  '2023-01-01 19:00:00-03',
  'podcast',
  'Podcast',
  true,
  '{"palestrantes":[],"info_podcast":true}'::jsonb
);

COMMIT;
