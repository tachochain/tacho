import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

export default function Home() {
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [number, setNumber] = useState(2);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function getImages() {
    if (token != "" && prompt != "") {
      setError(false);
      setLoading(true);
      axios
        .post(`/api/images?t=${token}&p=${prompt}&n=${number}`)
        .then((res) => {
          setResults(res.data.result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setError(true);
    }
  }

  const [type, setType] = useState("webp");

  function download(url) {
    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${prompt}.${type.toLowerCase()}`;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Üben Sie die Sprache</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Übungen zur Bildfrage <span className={styles.titleColor}>B1 test</span>
        </h1>
        <p className={styles.description}>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="der Schlüssel"
          />
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Fotobeschreibung"
          />
          <input
            id="number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="zuzeit max 2"
            max="2"
          />
          {"  "}
          <button onClick={getImages}>Zeichne Bild {number} Bild</button>
        </p>
        <small>
          Herunterladen:{" "}
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="webp">Webp</option>
            <option value="png">Png</option>
            <option value="jpg">Jpg</option>
            <option value="gif">Gif</option>
            <option value="avif">Avif</option>
          </select>
          {" "}
          Klicken Sie auf das Bild unten und speichern Sie es.
        </small>
        <br />
        {error ? (<div className={styles.error}>etwas ist schief gelaufen. Versuchen Sie es nochmal.</div>) : (<></>)}
        {loading && <p>Loading...</p>}
        <div className={styles.grid}>
          {results.map((result) => {
            return (
              <div className={styles.card}>
                <img
                  className={styles.imgPreview}
                  src={result.url}
                  onClick={() => download(result.url)}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
