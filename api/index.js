import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3910;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data.json');

app.use(express.json());

const readData = () => JSON.parse(fs.readFileSync(dataFile));
const writeData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

app.get('/api/v1', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/v1', (req, res) => {
  const data = readData();
  data.push(req.body);
  writeData(data);
  res.status(201).json({ message: 'Data added', data: req.body });
});

app.get('/api/v1/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();
  if (index >= 0 && index < data.length) {
    res.json(data[index]);
  } else {
    res.status(404).json({ error: 'Index out of range' });
  }
});

app.delete('/api/v1/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const data = readData();
  
    if (index >= 0 && index < data.length) {
      const deleted = data.splice(index, 1);
      writeData(data);
      res.json({ message: 'Data deleted', deleted: deleted[0] });
    } else {
      res.status(404).json({ error: 'Index out of range' });
    }
  });
  
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

export default app;
