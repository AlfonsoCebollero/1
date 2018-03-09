const {models}= require('./model');
const Sequelize = require('sequelize');

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

	models.quiz.findAll()
	.each(quiz => {
		
			log(`[${colorize(quiz.id,'magenta')}]: ${quiz.question}`);
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(()=> {
		rl.prompt();
	});
};
const validateId = id => {
	return new Sequelize.Promise((resolve,reject) => {
		if (typeof id === "undefined") {
			reject(new Error(`Falta el parametro <id>. `));
		} else {
			id = parseInt(id);
			if (Number.isNaN(id)){
				reject(new Error(`El valor del parametro <id> no vale. `));
			}else{
				resolve(id);
			}

		}
	});
};


exports.showCmd = (rl, id) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if(!quiz){
			throw new Error(`No existe un quiz asociado al id= ${id}.`);
		}
		log(`[${colorize(quiz.id,'magenta')}]: ${quiz.question} ${colorize('=>','blue')} ${quiz.answer}`);
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};




exports.testCmd = (rl,id) => {

	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz =>{
		if(!quiz){
			throw new Error(`No existe un quiz asociado al id= ${id}.`);
		}
		
		})
















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

const makeQuestion = (rl,text) => {

	return new Sequelize.Promise((resolve,reject)=> {
		rl.question(colorize(text,'red'),answer => {
			resolve(answer.trim());
		});
	});
};


exports.addCmd = rl => {
	makeQuestion(rl, 'Introduzca una pregunta: ')
	.then(q => {
		return makeQuestion(rl, 'Introduzca la respuesta: ')
		.then(a => {
			return {question: q, answer: a};
		});
	})
	.then(quiz => {
		return models.quiz.create(quiz);
	})
	.then(quiz => {
		log(`${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
	})
	.catch(Sequelize.ValidationError, error =>{
		errorlog('El quiz es erroneo');
		error.errors.forEach(({message})=> errorlog(message));
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(()=> {
		rl.prompt();
	});

};
exports.deleteCmd = (rl, id) => {
		validateId(id)
		.then(id => models.quiz.destroy({where: {id}}))
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
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
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if(!quiz){
			throw new Error(`Ǹo existe un quiz asociado al id=${id}.`);
		}

		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
		return makeQuestion(rl, 'Introduzca la pregunta: ')
		.then( g => {
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
			return makeQuestion(rl, 'Introduzca la respuesta')
			.then(a => {
				quiz.question = q;
				quiz.answer= a;
				return quiz;
			});


		});

	})
	.then(quiz => {
		return quiz.save();
	})
	.then(quiz => {
		log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errorlog('El quiz es erroneo');
		error.errors.forEach(({message})=> errorlog(message)); // Me devuelve todos los errores de la matriz errors
	})
	.catch(error => {
		errorlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
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