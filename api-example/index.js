/*
Cat Facts API
---------------------

GET / 
- Root page

GET /fact
- Sends a random cat fact in plain text

GET /facts
- Sends all facts on the server

PUT /newfact:fact
- Adds the fact param to the list of cat facts.

*/

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let facts = [
    "Cats have five toes on their front paws but only four toes on their back paws.",
    "A group of cats is called a clowder.",
    "Cats can rotate their ears 180 degrees, with the help of 32 muscles that they use to control them.",
    "A cat's nose is as unique as a human's fingerprint, with a unique pattern of ridges and bumps.",
    "The longest cat ever recorded was 48.5 inches long from nose to tail tip.",
    "Cats can make over 100 different sounds, whereas dogs can only make about 10.",
    "Ancient Egyptians revered cats and even worshiped a cat goddess named Bastet.",
    "Cats spend approximately two-thirds of their life sleeping, which means a nine-year-old cat has been awake for only three years of its life.",
    "A cat's whiskers are roughly as wide as its body, which helps the animal determine whether it can fit through narrow openings.",
    "The first cat in space was a French cat named Félicette (or 'Astrocat') who, in 1963, survived a trip to space that lasted 13 minutes."
]


app.get('/', (_, res) => {
    res.send('Use /fact to see an interesting cat fact!');
});

app.get('/fact', (_, res) => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    const randomFact = facts[randomIndex];
    res.send(randomFact);
});

app.get('/facts', (_, res) => {
    res.send(facts);
});

app.put('/newfact:fact', (req, res) => {
    const newFact = req.params.fact.slice(1);
    facts.push(newFact);
    res.send(`New fact added: ${newFact}`);
});

app.listen(8080, () => {
    console.log('Cat facts listening at http://localhost:8080');
});
