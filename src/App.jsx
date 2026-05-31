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
            content: `The user wrote a thought in Persian or English. Reply in the same language as the user's thought. Help them see what they're really saying — cut through the noise and find the core. Then ask one sharp question that challenges or deepens the thought. Do not comment on spelling, grammar, or writing style. Be concise, no headers: "${thoughts[index].text}"`
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