import './ThoughtCard.css'
import LoadingDots from './LoadingDots'

function ThoughtCard({ thought, index, onDelete, onRetry }) {
  return (
    
    <div className='thought-card'>
        
      <p dir='auto'>{thought.text}</p>
      
      {thought.tag && (
        <span className={`thought-tag tag-${thought.tag}`}>
          {thought.tag}
        </span>
      )}

      <div className='thought-card-footer'>
        
        <span className='thought-card-time'>{thought.time}</span>
        
        <div className='thought-card-buttons'>

          <button
            className='btn-delete'
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </div>
      </div>

      {thought.expansion === 'Thinking...' ? (
        <LoadingDots />
      ) : thought.expansion ? (
        <div className='thought-card-expansion' dir='auto'>
          {thought.expansion}
        </div>
      ) : null}

      {thought.expansion === 'No response from model' && (
        <button
          className='btn-retry'
          onClick={() => onRetry(index)}
        >
          Retry ↺
        </button>
      )}

    </div>
  )
}

export default ThoughtCard