import React from 'react'

export default function ImageInput({value , setValue}) {
  return (
    <div>
      <label htmlFor='image_file'>
        <input 
        id="image_file"
        type='file' className='invisible'/>
      </label>
    </div>
  )
}
