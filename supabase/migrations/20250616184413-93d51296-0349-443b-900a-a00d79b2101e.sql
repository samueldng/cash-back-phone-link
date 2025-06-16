
-- Deletar todos os dados das tabelas (mantendo a estrutura)
DELETE FROM transactions;
DELETE FROM customers;

-- Resetar as sequências (se houver)
-- Para a tabela cashback_settings, se você quiser resetar o ID:
ALTER SEQUENCE IF EXISTS cashback_settings_id_seq RESTART WITH 1;

-- Opcional: Resetar as configurações para os valores padrão
DELETE FROM cashback_settings;
INSERT INTO cashback_settings (cashback_percentage, minimum_redemption, eligible_categories) 
VALUES (5.00, 15.00, ARRAY['acessorios']);
