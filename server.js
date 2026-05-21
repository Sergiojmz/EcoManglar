const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let donations = [];
let volunteers = [];
let projects = [
  { id: 1, title: 'Reforestación Bahía Verde', location: 'Bahía Verde, Magdalena', progress: 62 },
  { id: 2, title: 'Protección de crías de sábalo', location: 'Estuario Ciénaga', progress: 40 },
  { id: 3, title: 'Senderos educativos', location: 'Reserva El Manglar', progress: 85 }
];

app.get('/api/donations', (req, res) => {
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const donation = { id: Date.now(), ...req.body, date: new Date() };
  donations.push(donation);
  res.json(donation);
});

app.get('/api/volunteers', (req, res) => {
  res.json(volunteers);
});

app.post('/api/volunteers', (req, res) => {
  const volunteer = { id: Date.now(), ...req.body, date: new Date() };
  volunteers.push(volunteer);
  res.json(volunteer);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/stats', (req, res) => {
  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalVolunteers = volunteers.length;
  res.json({
    totalDonations,
    totalVolunteers,
    projectsCount: projects.length
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});