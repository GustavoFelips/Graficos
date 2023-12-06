var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://awxovpdj:wO9oQuay_eoojYGdZuDIvhlii9SlaTo4@isabelle.db.elephantsql.com/awxovpdj" //Can be found in the Details page
var client = new pg.Client(conString);
var agua;

async function conexao(){
    try{
        await client.connect();
        console.log('conectando..');

        //consulta para gráfico de infraetrutura
        agua = await client.query("SELECT localizacao.nome_regiao,COUNT(agua) AS agua FROM infraetrutura INNER JOIN localizacao on localizacao.id_local = infraetrutura.id_local where agua = true group by localizacao.nome_regiao;");
        const esgoto = await client.query("SELECT localizacao.nome_regiao,COUNT(esgoto) AS esgoto FROM infraetrutura INNER JOIN localizacao on localizacao.id_local = infraetrutura.id_local where esgoto = true group by localizacao.nome_regiao;");
        const energia = await client.query("SELECT localizacao.nome_regiao,COUNT(energia) AS energia FROM infraetrutura INNER JOIN localizacao on localizacao.id_local = infraetrutura.id_local where energia = true group by localizacao.nome_regiao;");

        //consulta para gráfico de tecnologia
        const tv = await client.query("SELECT localizacao.nome_regiao,COUNT(tv) AS tv FROM tecnologia INNER JOIN localizacao on localizacao.id_local = tecnologia.id_local where tv = true group by localizacao.nome_regiao;");
        const internet = await client.query("SELECT localizacao.nome_regiao,COUNT(internet) AS internet FROM tecnologia INNER JOIN localizacao on localizacao.id_local = tecnologia.id_local where internet = true group by localizacao.nome_regiao;");
        const laboratorio = await client.query("SELECT localizacao.nome_regiao,COUNT(laboratorio_info) AS laboratorio FROM tecnologia INNER JOIN localizacao on localizacao.id_local = tecnologia.id_local where laboratorio_info = true group by localizacao.nome_regiao;");

        //consulta para gráfico de ensino
        const fundamental = await client.query("SELECT localizacao.nome_regiao,COUNT(escolaridade) AS fundamental FROM ensino INNER JOIN localizacao on localizacao.id_local = ensino.id_local where escolaridade = 'Fundamental' group by localizacao.nome_regiao;")
        const fundamental_medio = await client.query("SELECT localizacao.nome_regiao,COUNT(escolaridade) AS Fundamental_Medio FROM ensino INNER JOIN localizacao on localizacao.id_local = ensino.id_local where escolaridade = 'Fundamental/Medio' group by localizacao.nome_regiao;")
        const medio = await client.query("SELECT localizacao.nome_regiao,COUNT(escolaridade) AS Medio FROM ensino INNER JOIN localizacao on localizacao.id_local = ensino.id_local where escolaridade = 'Medio' group by localizacao.nome_regiao;")

        //consulta para gráfico de alunos
        const qt_turmas_fund = await client.query("SELECT localizacao.nome_regiao, AVG(qt_turmas_fundam) from discentes inner join matricula on discentes.id_matricula = matricula.id_matricula inner join localizacao on matricula.id_local = localizacao.id_local where matricula.ensino = 'Fundamental' or matricula.ensino = 'Fundamental/Medio' GROUP BY localizacao.nome_regiao;");
        const qt_turmas_medio = await client.query("SELECT localizacao.nome_regiao, AVG(qt_turmas_medio) from discentes inner join matricula on discentes.id_matricula = matricula.id_matricula inner join localizacao on matricula.id_local = localizacao.id_local where matricula.ensino = 'Medio' or matricula.ensino = 'Fundamental/Medio' GROUP BY localizacao.nome_regiao;")

        //consulta para gráfico professores
        const qt_prof_fund = await client.query("SELECT localizacao.nome_regiao, AVG(qt_prof_fundam) AS media_prof from professores inner join matricula on professores.id_matricula = matricula.id_matricula inner join localizacao on matricula.id_local = localizacao.id_local where matricula.ensino = 'Fundamental' or matricula.ensino = 'Fundamental/Medio' group by localizacao.nome_regiao;");
        const qt_prof_medio = await client.query("SELECT localizacao.nome_regiao, AVG(qt_prof_fundam) AS media_prof from professores inner join matricula on professores.id_matricula = matricula.id_matricula inner join localizacao on matricula.id_local = localizacao.id_local where matricula.ensino = 'Medio' or matricula.ensino = 'Fundamental/Medio' group by localizacao.nome_regiao;");
        
        
        console.log(tv.rows);
    
    }catch(err){
        console.error("erro ao consultar")
    }finally{
        await client.end();
        console.log("conexao encerrada")
    }
}

conexao();

console.log(agua[0])