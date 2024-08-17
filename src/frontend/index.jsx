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
    console.log(`Fetching comments for issue: ${issueId}`);

    // modify to take issueId variable
    const res = await requestJira(`/rest/api/3/issue/${issueId}`);
    const data = await res.json();
    console.log(data);
    console.log([data.fields.summary, data.fields.description.content[0].content[0].text]);
    return [data.fields.summary, data.fields.description.content[0].content[0].text];
  };

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
