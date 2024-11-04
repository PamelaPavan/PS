import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

# Dados de conexão a partir do arquivo .env
host = os.getenv('host')
user = os.getenv('user')
password = os.getenv('password')
database = os.getenv('database')

try:
    # Conectar ao MySQL
    connection = mysql.connector.connect(
        host=host,
        user=user,
        password=password
    )

    if connection.is_connected():
        cursor = connection.cursor()

        # Criar o banco de dados com o nome definido no .env
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database};")
        cursor.execute(f"USE {database};")

        # Criar a tabela `tarefas`
        create_table_query = """
        CREATE TABLE IF NOT EXISTS tarefas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(1000),
            custo DOUBLE,
            data_limite DATE,
            ordem_apresentacao INT UNIQUE
        );
        """
        cursor.execute(create_table_query)

        # Criar a trigger `incrementar_ordem_apresentacao`
        create_trigger_query = """
        CREATE TRIGGER incrementar_ordem_apresentacao
        BEFORE INSERT ON tarefas
        FOR EACH ROW
        BEGIN
            SET NEW.ordem_apresentacao = (SELECT COALESCE(MAX(ordem_apresentacao), 0) + 1 FROM tarefas);
        END;
        """
        cursor.execute(create_trigger_query)

        print("Banco de dados, tabela e trigger criados com sucesso.")

except Error as e:
    print("Erro ao conectar ao MySQL ou ao criar a estrutura:", e)

finally:
    # Fechar conexão
    if 'connection' in locals() and connection.is_connected():
        cursor.close()
        connection.close()
        print("Conexão com MySQL fechada.")
