import Resolver from '@forge/resolver';
import api, { route } from "@forge/api";
const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);
  const response = api.asUser().requestJira(route`/rest/api/3/search`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer'
    }
  });
  console.log(response)
  return "response";
});

export const handler = resolver.getDefinitions();
