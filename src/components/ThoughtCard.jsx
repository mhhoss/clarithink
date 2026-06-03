import './ThoughtCard.css'

function ThoughtCard({ thought, index, onDelete, onClarify }) {
  return (
    
    <div className='thought-card'>
        
      <p>{thought.text}</p>

      <div className='thought-card-footer'>
        
        <span className='thought-card-time'>{thought.time}</span>
        
        <div className='thought-card-buttons'>

          {!thought.expansion && (
            <button
              className="btn-clarify"
              onClick={() => onClarify(index)}
            >
              Clarify →
            </button>
          )}
          <button
            className='btn-delete'
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </div>
      </div>

      {thought.expansion && (
        <div className='thought-card-expansion'>
          {thought.expansion}
        </div>
      )}

    </div>
  )
}

export default ThoughtCard