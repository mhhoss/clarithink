function ThoughtCard({ thought, index, onDelete, onClarify }) {
  return (
    <div style={{
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
      }}>{thought.text}</p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '12px', color: '#444' }}>{thought.time}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!thought.expansion && (
            <button
              onClick={() => onClarify(index)}
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
            onClick={() => onDelete(index)}
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
      {thought.expansion && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #2a2a2a',
          fontSize: '14px',
          color: '#aaa',
          lineHeight: '1.7',
          wordBreak: 'break-word'
        }}>
          {thought.expansion}
        </div>
      )}
    </div>
  )
}

export default ThoughtCard