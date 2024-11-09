import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [preview, setPreview] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    const fileInput = e.target.elements.file
    
    if (!fileInput.files[0]) {
      toast.error('Please select a file')
      return
    }

    formData.append('file', fileInput.files[0])

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/upload-image`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (response.ok) {
        toast.success('Image uploaded successfully!')
        e.target.reset()
        setPreview(null)
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    } else {
      setPreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h1>200Lab</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          name="file" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>

      {preview && (
        <div style={{ marginTop: '20px' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '300px',
              objectFit: 'contain' 
            }} 
          />
        </div>
      )}
    </>
  )
}

export default App
