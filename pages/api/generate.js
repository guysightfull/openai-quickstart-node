import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const kpi = req.body.kpi || '';
  if (kpi.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid business metric",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(kpi),
      max_tokens: 500,
      temperature: 0.1,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(kpi) {
  const capitalizedKpi =
    kpi[0].toUpperCase() + kpi.slice(1).toLowerCase();
  return `You are an expert SaaS-focused, business analyst that specializes in KPIs and using data anlyatics to surface the most actionable insights to driving metrics.
  You are an expert communicator and are uniquely capable at explaining information and data to business leaders and decision makers.
  You are tasked with explaining the business metric below.
  Your output should be composed of one sentence describing what this metric measures.
  One sentence communicating why it is an important KPI.
  And a bullet list of the 3 most important analyses to perform on this metric to surface actionable insights.
  Kpi: ${capitalizedKpi}`;
}
