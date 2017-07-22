import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import Translate from '@google-cloud/translate';
import { functions, admin, getFirebaseData } from './firebase';

const translate = Translate();
const languages = ['es', 'de', 'fr', 'sv', 'ga', 'it', 'jp'];

const doTranslate = (text, lang) =>
  translate.translate(text, lang).then(results => results[0]);

const app = express();
app.use(cors({ origin: true }));

app.get('/', async (req, res) => {
  res.json({
    hello: 'there',
  });
});

app.post('/sound', async (req, res) => {
  const { text, lang } = JSON.parse(req.body);
  try {
    const translation = await doTranslate(text, lang || 'es');
    res.json({
      text,
      translation,
    });
  } catch (err) {
    res.json({
      text,
      translation: 'problem, not matched',
    });
  }
});

export const api = functions.https.onRequest((req, res) => {
  if (!req.path) req.url = `/${req.url}`;
  return app(req, res);
});
