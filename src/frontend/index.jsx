import React from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
import { requestJira } from '@forge/bridge';

const App = () => {
  const context = useProductContext();

  // add these code to keep track of comments
  const [summary, setSummary] = React.useState();
  const [description, setDescription] = React.useState();
  const fetchSumamryAndDescriptionForIssue = async () => {
    // extract issue ID instead expecting one from function input
    const issueId = context?.extension.issue.id;
    console.log(`Fetching summary and description for issue ID: ${issueId}`);
    // modify to take issueId variable
    const res = await requestJira(`/rest/api/3/issue/${issueId}`);
    const data = await res.json();
    return [data.fields.summary, data.fields.description.content[0].content[0].text];
  };
  fetch('https://34bd-105-88-48-92.ngrok-free.app')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();  // or response.text() if the response is not JSON
    })
    .then(data => {
      console.log('Response data:', data);
      // Handle the data here
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  const fetchAllIssues = async () => {
    const res = await requestJira('/rest/api/3/search?');
    const data = await res.json();
    const extractedIssues = data.issues.map(issue => ({
      description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '',
      summary: issue.fields.summary || '',
      labels: issue.fields.labels || []
    }));

    console.log(extractedIssues);
  }
  React.useEffect(() => {
    if (context) {
      // extract issue ID from the context
      const issueId = context.extension.issue.id;
      console.log(`Issue ID: ${issueId}`);
      fetchSumamryAndDescriptionForIssue().then(([summary, description]) => {
        setSummary(summary);
        setDescription(description);
      });
    }
  }, [context]);

  return (
    <>
      <Text>Hello world!</Text>
      <Text>{`Summary: ${summary}, Description ${description}`}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
