import { useState, useEffect } from 'react'
import ThoughtCard from './ThoughtCard'
import ThoughtInput from './ThoughtInput'

function App() {
  const [thought, setThought] = useState('')
  const [thoughts, setThoughts] = useState(() => {
    const saved = localStorage.getItem('thoughts')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('thoughts', JSON.stringify(thoughts))
  }, [thoughts])

  function handleSave() {
    if (thought.trim() === '') return
    setThoughts([...thoughts, {
      text: thought,
      time: new Date().toLocaleTimeString(),
      expansion: null
    }])
    setThought('')
  }

  function handleDelete(index) {
    const deleted = thoughts.filter((_, i) => i !== index)
    setThoughts(deleted)
  }

  async function handleClarify(index) {
    const updated = [...thoughts]
    updated[index].expansion = 'Thinking...'
    setThoughts([...updated])

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: [
          {
            role: 'user',
            content: `You are a thinking clarity assistant. The user writes raw, unstructured thoughts. Your job is to transform the thought into clarity, not expand it, give advice, solve it, or provide therapy. Identify the core meaning and rewrite it clearly in one short paragraph. Keep the clarified thought concise and focused on the original meaning without introducing new ideas. Then ask one concise question that challenges a hidden assumption, bias, or missing perspective. Keep the question short and direct. Respond in the same language. Do not explain your reasoning. No bullet points or headers. Keep response to exactly 2 paragraphs. First paragraph: the clarified thought. Second paragraph: the question. User thought: "${thoughts[index].text}"`
          }
        ]
      })
    })

    const data = await response.json()
    updated[index].expansion = data.choices[0].message.content
    setThoughts([...updated])
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#e8e8e8',
      fontFamily: "'Inter', sans-serif",
      padding: '48px 24px',
      maxWidth: '680px',
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '20px',
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: '8px',
        letterSpacing: '-0.3px'
      }}>Clarithink</h1>
      <p style={{
        fontSize: '14px',
        color: '#555',
        marginBottom: '32px'
      }}>Write a thought. See it clearly.</p>

      <ThoughtInput
        thought={thought}
        setThought={setThought}
        handleSave={handleSave}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {thoughts.map((t, index) => (
          <ThoughtCard
            key={index}
            thought={t}
            index={index}
            onDelete={handleDelete}
            onClarify={handleClarify}
          />
        ))}
      </div>
    </div>
  )
}

export default App