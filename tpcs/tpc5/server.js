const http = require('http');
//var url = require('url');
const logger = require('./logger').logger;

const axios = require('axios');

logger.info(`Starting server ...`);


const PORT=4000
const HTTP_HEADER={'Content-Type':'text/html;charset=utf-8;'};

// =============== Aux Functions =============== //

function serve_404(res,http_code)
{
    res.writeHead(http_code,HTTP_HEADER);
    res.write("404 NOT FOUND");
    res.end();
}

function serve_index(res,http_code)
{
    res.writeHead(http_code,HTTP_HEADER);
    res.write('<!DOCTYPE html>');
    res.write('<html>');
    res.write('<head></head>');
    res.write('<body>');
    res.write('<h1>Escola de Música</h1>');
    res.write('<h3>Items</h3>');
    res.write('<ul>');
    res.write('<li><a href="http://localhost:4000/alunos">Alunos</a></li>');
    res.write('<li><a href="http://localhost:4000/cursos">Cursos</a></li>');
    res.write('<li><a href="http://localhost:4000/instrumentos">Instrumentos</a></li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
}

function serve_alunos(res,http_code)
{
    res.writeHead(http_code,HTTP_HEADER);
    axios.get('http://localhost:3000/alunos')
    .then(api_res => {
        api_res.data.forEach(aluno => {
            res.write(`<b>${aluno['id']}</b> <br/>`);
        });
        res.end();
    })
    .catch(error => {
        console.log('ERROR:',error);
    });
}

function serve_cursos(res,http_code)
{
    res.writeHead(http_code,HTTP_HEADER);
    axios.get('http://localhost:3000/cursos')
    .then(api_res => {
        api_res.data.forEach(curso => {
            res.write(`<b>${curso['id']}</b> <br/>`);
        });
        res.end();
    })
    .catch(error => {
        console.log('ERROR:',error);
    });
}

function serve_instrumentos(res,http_code)
{
    res.writeHead(http_code,HTTP_HEADER);
    axios.get('http://localhost:3000/instrumentos')
    .then(api_res => {
        api_res.data.forEach(instrumento => {
            res.write(`<b>${instrumento['id']}</b><br/>`);
        });
        res.end();
    })
    .catch(error => {
        console.log('ERROR:',error);
    });
}

// =============== ==== =============== //

try {
    http.createServer((req,res) =>
    {
        let http_code = 200;

        if(req.url.match(/^(((\/index)(\.html)?)|\/)$/))
        {
            serve_index(res,http_code);
        }
        else if(req.url == '/alunos')
        {
            serve_alunos(res,http_code);
        }
        else if(req.url.match(/\/alunos\/[a-zA-Z0-9]+/))
        {
            serve_alunos(res,http_code);
        }
        else if(req.url == '/cursos')
        {
            serve_cursos(res,http_code);
        }
        else if(req.url == '/instrumentos')
        {
            serve_instrumentos(res,http_code);
        }
        else
        {
            http_code = 404;
            serve_404(res,http_code);
        }
        logger.request(req.method, req.url, http_code);

    }).listen(PORT);
} 
catch(err) {
    logger.error(err);
}

logger.info(`Server opened in ${PORT}`);