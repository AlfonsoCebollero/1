const fs= require("fs");

const DB_FILENAME = "quizzes.json";


let quizzes = [
	{
		question:"Capital de Italia",
		answer: "Roma"
	},
	{
		question:"Capital de Francia",
		answer: "Paris"
	},
	{
		question:"Capital de España",
		answer: "Madrid"
	},
	{
		question:"Capital de Portugal",
		answer:"Lisboa"
	}
];
// Carga las preguntas en el fichero

const load = () => {
	fs.readFile(DB_FILENAME,(err,data)=>{
			if(err){
				//La primera vez no existe el fichero
				if(err.code === "ENOENT"){
					save(); //Valores iniciales
					return;
				}
				throw err;
			}

			let json = JSON.parse(data);
			if(json){
				quizzes=json;
			}
	});
};

const save = () => {
	fs.writeFile(DB_FILENAME,
		JSON.stringify(quizzes),
		err => {
			if (err) throw err;
		});
};


// Cuenta el numero de quizzes
exports.count = () => quizzes.length;
// Añade un quiz
exports.add = (question,answer) => {

	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};
// Actualiza un quiz
exports.update =(id,question,answer) => {

	const quiz = quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error(`El valor del parametro id no es valido`);
	}
	quizzes.splice(id,1,{
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};
// Devuelve todos lps quizzes
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));
// Devuelve el quiz con el id asignado
exports.getByIndex = id => {

	const quiz = quizzes[id];
	if (typeof quiz == "undefined") {
		throw new Error ('El valor del parametro id no es valido');
	}
	return JSON.parse(JSON.stringify(quiz));
};
// Elimina el quiz en la posicion dada
exports.deleteByIndex = id => {
	const quiz=quizzes[id];
	if(typeof quiz === "undefined"){
		throw new Error("El valor del parametro no es válido");
	}
	quizzes.splice(id,1);
	save();
};

// Carga los quizzes en el fichero.
load();