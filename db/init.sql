CREATE DATABASE IF NOT EXISTS task_db;
USE task_db;
-- 1. Criação das Tabelas
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE, -- Adicionei UNIQUE para evitar emails repetidos
    password VARCHAR(255)
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE task_categories (
    task_id INT,
    category_id INT,
    PRIMARY KEY (task_id, category_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 2. Inserção de Utilizadores (Importante: As passwords de todos os utilizadores para teste é "123")
INSERT INTO users (name, email, password) VALUES
('Igor Silva', 'igor1@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Ana Costa', 'ana@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('João Pedro', 'joao@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Maria Lopes', 'maria@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Carlos Dias', 'carlos@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Sofia Mendes', 'sofia@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Pedro Rocha', 'pedro@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Inês Martins', 'ines@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Rui Santos', 'rui@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Beatriz Alves', 'bia@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Tiago Sousa', 'tiago@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Marta Pinto', 'marta@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('André Gomes', 'andre@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Daniela Cruz', 'daniela@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Bruno Ferreira', 'bruno@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Carla Neves', 'carla@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Fábio Teixeira', 'fabio@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Patrícia Reis', 'patricia@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Ricardo Melo', 'ricardo@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Cláudia Barros', 'claudia@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Hugo Correia', 'hugo@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Vanessa Ribeiro', 'vanessa@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Miguel Castro', 'miguel@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Sara Antunes', 'sara@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Luís Pires', 'luis@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Helena Duarte', 'helena@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Nuno Faria', 'nuno@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Diana Carvalho', 'diana@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Paulo Azevedo', 'paulo@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K'),
('Raquel Fonseca', 'raquel@email.com', '$2b$10$cWG1LJY5Imwr2DyXbNsIF.bnkU7G9YfODowi.c.sa/MQZqNI.AR5K');

-- 3. Inserção de Categorias 
INSERT INTO categories (name) VALUES
('Estudo'), ('Trabalho'), ('Pessoal'), ('Saúde'), ('Programação'),
('Casa'), ('Fitness'), ('Leitura'), ('Organização'), ('Outros');

-- 4. Inserção de Tarefas 
INSERT INTO tasks (title, description, status, user_id) VALUES
('Estudar Node.js', 'Aprender Express', 'pendente', 1), ('Fazer trabalho DW', 'Criar API REST', 'em progresso', 1),
('Ir ao ginásio', 'Treino de pernas', 'feito', 2), ('Comprar comida', 'Ir ao supermercado', 'pendente', 3),
('Ler livro', 'Capítulo 5', 'pendente', 4), ('Estudar SQL', 'Joins e relações', 'em progresso', 5),
('Limpar quarto', 'Organizar tudo', 'feito', 6), ('Treinar inglês', 'Pronúncia', 'pendente', 7),
('Revisão de código', 'Projeto grupo', 'em progresso', 8), ('Ir correr', '30 minutos', 'pendente', 9),
('Ver aula', 'Backend', 'pendente', 10), ('Enviar email', 'Professor', 'feito', 11),
('Atualizar CV', 'Adicionar skills', 'pendente', 12), ('Aprender Docker', 'Containers', 'em progresso', 13),
('Configurar MySQL', 'Base de dados', 'feito', 14), ('Fazer backup', 'Guardar ficheiros', 'pendente', 15),
('Planejar semana', 'Organização', 'pendente', 16), ('Testar API', 'Postman', 'em progresso', 17),
('Corrigir bugs', 'Erros login', 'pendente', 18), ('Deploy projeto', 'DockerHub', 'pendente', 19),
('Criar documentação', 'OpenAPI', 'em progresso', 20), ('Reunião grupo', 'Discussão', 'feito', 21),
('Aprender OAuth', 'Autenticação', 'pendente', 22), ('Treinar código', 'JavaScript', 'pendente', 23),
('Ver tutorial', 'YouTube', 'feito', 24), ('Configurar servidor', 'Node', 'em progresso', 25),
('Testar login', 'JWT', 'pendente', 26), ('Criar rotas', 'CRUD', 'em progresso', 27),
('Adicionar middleware', 'Auth', 'pendente', 28), ('Finalizar projeto', 'Entrega', 'pendente', 29);

-- 5. Inserção de Relações Tarefa-Categoria
INSERT INTO task_categories (task_id, category_id) VALUES
(1,5),(1,1),(2,2),(2,5),(3,7),(4,6),(5,8),(6,1),(6,5),(7,6),(8,1),(9,5),(10,7),(11,1),(12,2),(13,2),(14,5),(15,5),(16,6),(17,9),(18,5),(19,5),(20,5),(21,2),(22,5),(23,5),(24,1),(25,5),(26,5),(27,5),(28,5),(29,5);