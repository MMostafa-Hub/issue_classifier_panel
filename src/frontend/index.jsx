import React from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
import { requestJira, invoke } from '@forge/bridge';

const App = () => {
  const context = useProductContext();
  const [issueAddedFlag, setIssueAddedFlag] = React.useState(false);
  const [issues, setIssues] = React.useState([]);
  const fetchAllIssues = async () => {
    const res = await requestJira('/rest/api/3/search?');
    const data = await res.json();
    const extractedIssues = data.issues.map(issue => ({
      description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '',
      summary: issue.fields.summary || '',
      labels: issue.fields.labels || []
    }));

    return extractedIssues;
  }

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
    if (!data.fields.description) {
      return [data.fields.summary, ''];
    }
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

      var collection_name = context?.extension.project.key
      collection_name = "sample_project"
      invoke("createCollection", { collection_name: collection_name }).then((res) => {
        console.log(res);
      });
    }
  }, [context]);

  React.useEffect(() => {
    fetchAllIssues().then((issues) => {
      setIssues(issues);
    });
  }, []);

  React.useEffect(() => {

    if (issues.length > 0) {
      console.log(issues);
      invoke("addIssues", { issues: issues }).then((res) => {
        console.log(res);
        setIssueAddedFlag(true);
      });
    }

  }, [issues]);

  const [predictedLabels, setPredictedLabels] = React.useState([]);
  React.useEffect(() => {
    console.log("Issues added flag: ", issueAddedFlag);
    if (issueAddedFlag == true) {
      console.log("Issues added, getting prediction");
      invoke("getPrediction", { summary: summary, description: description }).then((res) => {
        console.log(res);
        setPredictedLabels(res["prediction"]);
      });
    }
  }, [issueAddedFlag]);


  return (
    <>
      <Text>{`Summary: ${summary}, Description: ${description}`}</Text>
      <Text>{`Issues in the project: ${issues.length}`}</Text>
      <Text>{`Predicted Labels: ${predictedLabels}`}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
