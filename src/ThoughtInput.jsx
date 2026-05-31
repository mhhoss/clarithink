function ThoughtInput({ thought, setThought, handleSave }) {
  return (
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
        
  )
}

export default ThoughtInput