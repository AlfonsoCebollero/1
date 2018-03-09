const model= require('./model');

const {log, biglog, errorlog, colorize}= require("./out");

exports.helpCmd = rl => {
	log('Comandos:');
	log(" h/help - Muestra la ayuda.");
	log(" list - Listar los quizzes existentes");
	log(" show <id> - Muestra la pregunta y la respuesta del quiz indicado");
	log(" add - Añadir un nuevo quiz existente");
	log(" delete <id> - Borrar el quiz indicado");
	log(" edit <id> - Editar el quiz indicado");
	log(" test <id> - Probar el quiz indicado");
	log(" p|play - Jugar a preguntas aleatorias de todos los quizzes");
	log(" credits - Créditos");
	log(" q|quiz - Salir del programa.");
	rl.prompt();
};

exports.listCmd = rl => {
	model.getAll().forEach((quiz,id) => {
		log(`[${colorize(id,'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

exports.showCmd = (rl, id) => {
	
	if( typeof id === "undefined"){
		errorlog(`Falta el parametro id`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};
exports.testCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
    } else {
        try{
            const quiz = model.getByIndex(id);
           	rl.question(`${colorize(quiz.question + " ", 'red')}`, answer=>{ 
            if(answer.toLowerCase().trim()===quiz.answer.toLowerCase().trim()){
                log('Su respuesta es correcta');
                biglog('Correcta','green');
                rl.prompt();
            }

            else{
            	log('Su respuesta es incorrecta');
                biglog("Incorrecta",'red');
                rl.prompt();
            }
        });
        }catch(error){
            errorlog(error.message);
            
        }
    }
    rl.prompt();
};
exports.addCmd = rl => {
	rl.question(colorize('Introduzca una pregunta: ','red'), question => {
		rl.question(colorize('Introduzca una respuesta:  ','red'),answer => {
			model.add(question,answer);
			log(`${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
	
};
exports.deleteCmd = (rl, id) => {
		if (typeof id === "undefined") {
		errorlog('Falta el parametro id. ');
	} else {
		try {
			model.deleteByIndex(id);
		} catch (error) {
			errorlog(error.message);
		}
	}
		rl.prompt();
};

exports.playCmd = rl => {

	let score = 0; //variable que guarda la puntuación

	let preguntasRestantes = []; //Array con índices de las preguntas que existen
	
	for (var i = 0; i < model.count(); i++){
		//preguntasRestantes[i] = model.getByIndex[i];
		preguntasRestantes[i] = i;
	}	

	const playOne = () => {

		if(preguntasRestantes.length == 0){
			log('¡No hay más preguntas!');
			log(`Su puntuación final es... `);
			biglog(`${score}`,'red');
			log("¡¡¡ENHORABUENA!!!",'red');
			rl.prompt();

		} else {

				let pos = Math.floor(Math.random() * preguntasRestantes.length);
				let id = preguntasRestantes[pos];
				let quiz = model.getByIndex(id);
				preguntasRestantes.splice(pos, 1);


				rl.question(colorize(quiz.question + "?\n",'yellow'), answer1 => {
				if (String(answer1.trim().toLowerCase()) === String(quiz.answer.toLowerCase())){
					score += 1;
					log("....................................................................................................................................................................................");
					log("\nCorrecto\n", 'green');
					biglog("\nCorrecto\n", 'green');
					if(score === 1) {log(`Lleva ${score} acierto`);	}
					else {	log(`Lleva ${score} aciertos`);	}
					playOne(); 
				}
				else{
					log(`INCORRECTO`);
					log(`Fin del juego, aciertos`);
					biglog(score, 'blue');
		
					
				} rl.prompt();
			});
		}
	}

	playOne();

};

exports.editCmd = (rl,id) => {
	if( typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize('Introduzca una pregunta: ','red'),question =>{

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				
				rl.question(colorize('Introduzca una respuesta:  ','red'),answer => {
					model.update(id,question,answer);
					log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};
exports.quitCmd=rl => {
	rl.close();
	rl.prompt();

};


exports.creditsCmd = rl => {
	log("Autores de la practica: ");
    log("Daniel Lledó Raigal",'green');
   	log("Alfonso Cebollero Massia",'green');
   	rl.prompt();
};