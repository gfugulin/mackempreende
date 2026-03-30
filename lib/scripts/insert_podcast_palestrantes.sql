BEGIN;

-- ==========================================
-- INSERIR CONVIDADOS DO PODCAST NO DIRETÓRIO
-- ==========================================

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Ariel Quadros', NULL, 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Ariel Quadros'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Rafael Calixto', 'Fundador & CRO — Scalable', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Rafael Calixto'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Beatriz Tolezano', 'Gerente de Marketing SMB — TikTok América Latina', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Beatriz Tolezano'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Gabriel Didier', 'Gerente de Comunicações Externas — Ambev', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Gabriel Didier'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Gustavo Giglio', 'Head de Marketing de Relacionamento & Creator Unlock CCXP — Omelete Company', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Gustavo Giglio'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Alexandre Capella', 'Sócio & Diretor de Operações — Mais Mu', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Alexandre Capella'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Eduardo Hauaji', 'Google for Startups Cloud Program', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Eduardo Hauaji'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Isabella Scarpelli', 'Ela & Client Partner — Spotify', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Isabella Scarpelli'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Veronica Schneider', 'Gerente de Estratégia de Conteúdo — CNN Brasil', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Veronica Schneider'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Bruno Rohifs', 'Fundador & CEO — Push Matcha', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Bruno Rohifs'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Erich Shibata', 'Diretor Criativo — Cimed', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Erich Shibata'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Nathália Thomazéli', 'Gerente de Comunicação — Bruna Tavares', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Nathália Thomazéli'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Letícia Pavim', 'Trainee Kraft Heinz / Fundadora — Rede Pavim', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Letícia Pavim'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Rodrigo Maroja', 'Co-fundador — Daki', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Rodrigo Maroja'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Filipe Rocha', 'Gerente de Design — Coca-Cola', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Filipe Rocha'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Laura Barros', 'Diretora de Marketing — Wine', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Laura Barros'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Tiago Mavichian', 'CEO — Companhia de Estágios', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Tiago Mavichian'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Gustavo Piedade', 'COO — EdTech Síndria', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Gustavo Piedade'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Naara Risseto', 'Dona — Naah Store', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Naara Risseto'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Fábio Arten', 'Estrategista / Professor', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Fábio Arten'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Flávio Valati', NULL, 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Flávio Valati'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Fabiana Quezada', 'Advogada / Empreendedora', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Fabiana Quezada'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Tarcísio Freitas', 'Empreendedor / Visionário', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Tarcísio Freitas'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Lucas Bravo', 'Empreendedor / @studiies.com.br', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Lucas Bravo'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Ana Marinho', 'Fundadora — Corporate Girls Club', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Ana Marinho'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Gabriela Mussallam', 'Fundadora — Mussa Sweets', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Gabriela Mussallam'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Daniel Chalfon', 'Sócio — Astella', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Daniel Chalfon'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Marcela Lahoz (@tchela)', 'Criadora de conteúdo / Time comercial — The News', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Marcela Lahoz (@tchela)'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Lucas Callazzo', 'Especialista em alocação de fundos no XP Inc. / Colunista InfoMoney / Host Stock Pickers', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Lucas Callazzo'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Reinaldo Passadori', 'Fundador — Passadori Comunicação', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Reinaldo Passadori'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Reinaldo Domingos', 'Criador do Método DSOP', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Reinaldo Domingos'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Deiverson Migliatti', 'Fundador — Sterna Café', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Deiverson Migliatti'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Zé Caporrino', 'Head de Criação — Chilli Beans', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Zé Caporrino'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Leonardo Quintão', 'Fundador — Smoov', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Leonardo Quintão'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Fernando Souza', 'CEO — Grupo FIT', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Fernando Souza'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Harry Carqueira', 'Co-fundador — Delend / Professor Endeavor', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Harry Carqueira'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Paula Veloso', 'Fundadora — Cafellow', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Paula Veloso'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Guilherme Gallina', 'Líder Red Bull / Sócio — Dates Snacks', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Guilherme Gallina'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Luciana Passadori', 'Co-fundadora Alma / IVG — Elas por Elas', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Luciana Passadori'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'José Oliver', 'Head de Inovação e Novos Negócios — São Paulo FC', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'José Oliver'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Mack Finanças', 'Líderes de entidades estudantis do Mackenzie', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Mack Finanças'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Mack Ventures', 'Líderes de entidades estudantis do Mackenzie', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Mack Ventures'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Bruno Katayama', 'Ex-bancos JP Morgan / Dono de restaurantes', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Bruno Katayama'
);

INSERT INTO palestrantes (nome, empresa, status, squad_resp)
SELECT 'Matteo Custo', 'Analista M&A / Co-fundador — The Founders', 'contatado', 'Podcast'
WHERE NOT EXISTS (
  SELECT 1 FROM palestrantes WHERE nome ILIKE 'Matteo Custo'
);

COMMIT;
