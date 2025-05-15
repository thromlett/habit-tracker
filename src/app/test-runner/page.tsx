// app/page.tsx
'use client';

import { useState } from 'react';
//import clientPromise from '../../lib/mongodb';

interface TestResult {
  success: boolean
  output?: string
  error?: string
}

//type Item = { _id: string; name: string; description?: string };

export default function HomePage() {

  const [output, setOutput] = useState<string>('')

  const runTests = async (file?: string) => {
    const query = file ? `?file=${file}` : ''
    const res = await fetch(`/api/run-tests${query}`)
    const { output } = await res.json()
    setOutput(output)
  }

  return (
    <div>
      <h1>Jest Test Runner</h1>
      <button onClick={() => runTests('testPass.test.js')}>
        Run Passing Test
      </button>
      <button onClick={() => runTests('testFail.test.js')}>
        Run Failing Test
      </button>
      <button onClick={() => runTests()}>
        Run All Tests
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
        {output}
      </pre>
    </div>
  )
}



export async function DBTest() {

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const rawItems = await db.collection('comments').find({}).toArray();

  //API stuff
  //page stuff
  //API call end point 
  //next.js equivalent of Redux
  //Prisma ORM
  //github action
  //auto run unig test

  //ORM research

  const items: Item[] = rawItems.map(doc => ({
    _id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
  }));

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>My Items</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item._id} style={{ marginBottom: '1rem' }}>
              <strong>{item.name}</strong>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
