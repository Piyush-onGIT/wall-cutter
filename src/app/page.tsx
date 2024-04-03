"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<any>();
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [result, setResult] = useState<
    {
      rows: number;
      columns: number;
      pax: number;
    }[]
  >();
  const [pax, setPax] = useState<number>(0);
  const [vary, setVary] = useState<number>(0);

  const cutter = (pax: number, vary: number) => {
    let results = [];
    let vis = new Map();

    let i = 1;
    while (i <= width && i <= height) {
      const rows = Math.floor(height / i);
      const columns = Math.floor(width / i);
      const tmpPax = rows * columns;

      if (tmpPax >= pax - vary && tmpPax <= pax + vary) {
        const key = `${rows},${columns}`;
        if (!vis.has(key)) {
          vis.set(key, 1);
          results.push({
            rows: rows,
            columns: columns,
            pax: rows * columns,
          });
        }
      }
      i++;
    }

    const filtered = results.filter(
      (result) => result.pax >= pax - 10 && result.pax <= pax + 10
    );
    setResult(filtered);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const width = img.width;
          const height = img.height;
          console.log(`Got image of dimension: ${width}x${height}`);

          setWidth(width);
          setHeight(height);
        };

        img.src = event.target!.result as string;
      };

      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  return (
    <main>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <input
        style={{ color: "black" }}
        type="text"
        placeholder="Pax"
        onChange={(e) => setPax(parseInt(e.target.value))}
      />
      <br />
      <input
        style={{ color: "black" }}
        type="text"
        placeholder="Vary"
        onChange={(e) => setVary(parseInt(e.target.value))}
      />
      <br />
      <button onClick={() => cutter(pax, vary)}>Get</button>
      {result?.map((r, index) => (
        <div key={index}>
          Rows: {r.rows}, Columns: {r.columns}, Pax Needed: {r.pax}
          <br />
        </div>
      ))}
    </main>
  );
}
