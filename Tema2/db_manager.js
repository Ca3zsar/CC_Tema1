const { Pool, Client } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
};

async function getClient()
{
    const client = new Client(credentials);
    await client.connect();

    return client;
}

async function getBookById(id){
    const queryText = 'SELECT * FROM books WHERE id = $1';
    const values = [id];
    const result = await global.client.query(queryText, values);

    return result;
}

async function getAllBooks(){
    const queryText = 'SELECT * FROM books';
    const result = await global.client.query(queryText);

    return result;
}

async function addNewBook(title, author, category)
{
    const queryText = 'INSERT INTO public.books(title, author, category) VALUES ($1, $2, $3) RETURNING id;';
    const values = [title, author, category]
    const result = await global.client.query(queryText, values);

    return result.rows[0].id;
}

async function modifyBook(id, title, author, category)
{
    const queryText = 'UPDATE public.books SET title=$1, author=$2, category=$3 WHERE id=$4 RETURNING id;';
    const values = [title, author, category, id]
    const result = await global.client.query(queryText, values);
    return result.rows;
}

async function deleteBook(id)
{
    const queryText = 'DELETE FROM public.books WHERE id = $1 RETURNING id;';
    const values = [id];
    const result = await global.client.query(queryText, values);

    return result.rows[0].id;
}


async function closeClient()
{
    await global.client.end();
}

global.client;
(async () => {
    global.client = await getClient();
})();

module.exports = { getAllBooks, getBookById, getClient, closeClient, addNewBook, modifyBook, deleteBook};