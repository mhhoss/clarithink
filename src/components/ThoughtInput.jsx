import './ThoughtInput.css'

function ThoughtInput({ thought, setThought, handleSaveAndClarify }) {
  return (
    <div className='thought-input-wrapper'>
      <div className='thought-input-container'>
        <textarea
          dir="auto"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSaveAndClarify()
            }
          }}
          placeholder="What's on your mind?"
          rows={3}
          className='thought-input'
        />
        <button
          onClick={handleSaveAndClarify}
          className="btn-clarify-submit"
        >
          ✦
        </button>
      </div>
    </div>
  )
}

export default ThoughtInput