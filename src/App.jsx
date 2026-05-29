import { useState, useEffect } from 'react'

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
      margin: '0 auto'
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

      <div style={{ marginBottom: '40px' }}>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            color: '#e8e8e8',
            fontSize: '15px',
            padding: '16px',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: '1.6'
          }}
        />
        <button
          onClick={handleSave}
          style={{
            marginTop: '12px',
            backgroundColor: '#ffffff',
            color: '#0f0f0f',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Save thought
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {thoughts.map((t, index) => (
          <div key={index} style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <p style={{
              fontSize: '15px',
              color: '#e8e8e8',
              marginBottom: '12px',
              lineHeight: '1.6'
            }}>{t.text}</p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '12px', color: '#444' }}>{t.time}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!t.expansion && (
                  <button
                    onClick={() => handleClarify(index)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#888',
                      fontSize: '13px',
                      padding: '6px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    Clarify →
                  </button>
                )}
                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#555',
                    fontSize: '13px',
                    padding: '6px 14px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            {t.expansion && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #2a2a2a',
                fontSize: '14px',
                color: '#aaa',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                {t.expansion}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App