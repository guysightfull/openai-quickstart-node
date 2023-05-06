import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [kpiInput, setKpiInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kpi: kpiInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.log("Results:",data.result);
      // log the result to the console
      setKpiInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/sightfull.png" />
      </Head>

      <main className={styles.main}>
        <img src="/sightfull.png" className={styles.icon} />
        <h3>Choose your KPI</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="kpi name"
            placeholder="Enter a KPI name"
            value={kpiInput}
            onChange={(e) => setKpiInput(e.target.value)}
          />
          <input type="submit" value="Generate analyses" />
        </form>
        <textarea className={styles.result} value={result} rows={15} cols={70}></textarea>
      </main>
    </div>
  );
}