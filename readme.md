<h1 align="center"> LISTA DE TAREFAS</h1>


<h2 align="center"> <i>Sistema Web para Cadastro de Tarefas</i></h2>


![img|Lista_de_Tarefas](src/img/img_head.png)

## 📌 Índice
 
- [Introdução](#introdução)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Base de Dados](#base-de-dados)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Acessar](#como-acessar)
- [Funcionalidades](#funcionalidades)
- [Autor](#autor)

## Introdução
<p align="justify">
Este projeto é uma aplicação web interativa que oferece uma interface para cadastro de Tarefas.
</p>


## Estrutura de Pastas
```
project-root
│
├── src
│   ├── config
│   ├── css
│   ├── img
│   ├── routes   
│   ├── scripts
│   ├── views
│   │
│   └── .gitignore  # Arquivos e pastas a serem ignorados pelo Git
│
└── readme.md       # Documentação do projeto

```

## Base de Dados

### Tabela: Tarefas
```
| Campo                      | Tipo de Dados | Descrição                                                                 |
|----------------------------|---------------|--------------------------------------------------------------------------|
| Identificador da tarefa    | INT           | Chave primária, identificador único da tarefa                            |
| Nome da tarefa             | VARCHAR       | Nome da tarefa                                                           |
| Custo (R$)                 | DECIMAL       | Custo da tarefa em reais                                                 |
| Data limite                | DATE          | Data limite para a conclusão da tarefa                                   |
| Ordem de apresentação      | INT           | Campo numérico, não repetido, que servirá para ordenar os registros na tela |

```

## Arquitetura do Projeto

## Como Acessar
Acesse: [Link - Lista de Tarefas](https://listatarefa-pamela-pavan.up.railway.app/)

## Funcionalidades
1) <p align="justify">Na página principal do sistema possui um botão "Nova Tarefa", para a inserção de tarefas. Ao selecionar este botão aparecerão campos de inserção para preencher com os valores de "Nome da Tarefa", "Custo da Tarefa" e data: "dd/mm/yyyy". Nesta parte é possível incluir registros selecionando o botão "Incluir";  
   Obs. Caso já exista uma tarefa com o novo nome escolhido, não será possível realizar a inclusão.  
3) Os cards contendo as informações da tarefa ficarão listados na parte superior da página;
4) Ao lado direito de cada registro são apresentados quatro botões, seta para cima (movimenta a tarefa para cima, caso haja alguma tarefa acima), seta para baixo (movimenta a tarefa para baixo, caso haja alguma tarefa abaixo), botão em formato de "lápis anotando" terá a função de **editar** a tarefa e o botão em formato de lixeira terá a função de **Excluir** o registro;  
Obs. Quando a tarefa tiver Custo maior ou igual a R$1.000,00 deverá ser apresentada com fundo amarelo;  
Veja abaixo um exemplo: </p> 

![img|Tarefas](src/img/image.png)

4) <p align="justify"> Ao selecionar o botão de **Excluir** será apresentado uma mensagem de confirmação (Sim/Não) para a realização da
exclusão; </p>  

5) <p align="justify"> Ao selecionar o botão de **Editar**, será direcionado para uma página de edição. Nesta nova página, será possível alterar o Nome da Tarefa, o Custo e/ou a Data; </p>
Obs. Caso já exista uma tarefa com o novo nome escolhido, não será possível realizar a edição.  
<p align="justify">
Além disso, é possível reordenar as tarefas utilizando "drag-and-drop".  
</p>

## Autor

Pâmela Aliny Cleto Pavan  

[Linkedin](https://www.linkedin.com/in/pâmela-pavan-607693190/)

[Meu Repositório no Github](https://github.com/PamelaPavan)




