import './ThoughtInput.css'

function ThoughtInput({ thought, setThought, handleSave }) {
  return (
    <div className='thought-input-wrapper'>
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSave()
          }
        }}
        placeholder="What's on your mind?"
        rows={4}
        className='thought-input'
      />
      <button
        onClick={handleSave}
        className="btn-save"
      >
        Save thought
      </button>
    </div>
        
  )
}

export default ThoughtInput