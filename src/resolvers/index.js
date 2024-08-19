import Resolver from '@forge/resolver';
import axios from 'axios';

const resolver = new Resolver();
export const BASE_URL = `https://chief-unified-moccasin.ngrok-free.app`;

const API = axios.create({ baseURL: BASE_URL });

resolver.define('createCollection', async (req) => {
  const { collection_name } = req.payload;
  try {
    const res = await API.post(`/collection`, null, {
      params: {
        collection_name: collection_name
      }
    }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
});

resolver.define('getPrediction', async (req) => {
  const { summary, description } = req.payload;
  try {
    const res = await API.get(`/prediction`, {
      params: {
        summary: summary,
        description: description
      }
    }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
});

resolver.define('addIssues', async (req) => {
  const { issues } = req.payload;

  try {
    const res = await API.post(`/issues`, issues, {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
});

export const handler = resolver.getDefinitions();
