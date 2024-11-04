<h1 align="center">Sistema Lista de Tarefas</h1>
<p align="justify">Desenvolva um sistema web para cadastro de Tarefas e publique a aplicação disponibilizando o
link para acesso. Os dados (tarefas) devem ser mantidos em um banco de dados. </p>

<h2> Base de dados </h2>
Tabela: Tarefas <br>
Campos: <br>
- Identificador da tarefa (chave primária) <br>
- Nome da tarefa <br>
- Custo (R$) <br>
- Data limite <br>
- Ordem de apresentação (campo numérico, não repetido, que servirá para ordenar os
registros na tela) <br>

<h2>Funcionalidades </h2>

#Lista de Tarefas <br>

<p align="justify">
É a página principal do sistema.
Deve listar todos os registros mantidos na tabela &quot;Tarefas&quot; (um abaixo do outro).
Todos os campos, exceto &quot;Ordem de apresentação&quot;, devem ser apresentados.
As tarefas devem ser apresentadas ordenadas pelo campo &quot;Ordem de apresentação&quot;.
A tarefa que tiver o &quot;Custo&quot; maior ou igual a R$1.000,00 deverá ser apresentada de forma
diferente (por exemplo: a linha inteira com o fundo amarelo).
Ao lado direito de cada registro devem ser apresentados dois botões (preferencialmente
ícones), uma para executar a função de &quot;Editar&quot; e outro para a função de &quot;Excluir&quot; registro.
Ao final da listagem deve existir um botão para executar a função de &quot;Incluir&quot; registro.
</p>

#Excluir <br>
<p align="justify">A função deve excluir o registro da Tarefa escolhida.
É necessário apresentar uma mensagem de confirmação (Sim/Não) para a realização da
exclusão.</p>

#Editar <br>
<p align="justify">
A função deve editar o registro da Tarefa escolhida.
Só é possível alterar o &quot;Nome da Tarefa&quot;, o &quot;Custo&quot; e a &quot;Data Limite&quot;.
É necessário verificar se o novo nome da tarefa já existe na base de dados. Se já existir, a
alteração não poderá ser feita.
</p>
A implementação pode ser feita de uma das duas formas abaixo (escolha uma): <br>
1) A edição é feita diretamente na tela principal (Lista de Tarefas), onde os três campos
são habilitados para edição. <br>
ou <br>
2) É aberta uma nova tela (popup) para edição dos três campos. <br>
<br>

#Incluir <br>
A função deve permitir a inclusão de uma nova tarefa.<br>
Apenas os campos &quot;Nome da Tarefa&quot;, &quot;Custo&quot; e &quot;Data Limite&quot; são informados pelo usuário. <br>
Os demais campos são gerados automaticamente pelo sistema. <br>
O registro recém-criado será o último na ordem de apresentação. <br>

Não pode haver duas tarefas com o mesmo nome.<br>

#Reordenação das tarefas <br>
A função deve permitir que o usuário possa alterar a ordem de apresentação de uma tarefa. <br>
A implementação pode ser feita de uma das duas formas abaixo (escolha uma, se possível, as
duas): <br>
1) Com o uso do mouse, o usuário arrasta uma tarefa para cima ou para baixo, soltando
na posição desejada. Estilo drag-and-drop. <br>
ou <br>
2) Em cada linha (registro) deve ter dois botões, uma para &quot;subir&quot; a tarefa na ordem de
apresentação e outro para &quot;descer&quot;. Obviamente a primeira tarefa não poderá &quot;subir&quot;
e nem a última poderá &quot;descer&quot;.
