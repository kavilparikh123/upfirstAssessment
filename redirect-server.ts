import express, { Request, Response } from 'express';

const app = express();
const PORT = 8081;

app.get('/process', (req: Request, res: Response) => {
    res.send(`Authorization Code: ${req.query.code}, State: ${req.query.state}`);
});

app.listen(PORT, () => {
    console.log(`Mock redirect server running on http://localhost:${PORT}`);
});
