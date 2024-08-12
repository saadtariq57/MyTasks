import React from 'react'

function Button({bgColor, text, onClick}) {
  
  return (
    <button onClick={onClick} style={{backgroundColor: bgColor}} className={`px-5 py-2 rounded-md text-lg font-semibold`}>
        {text}
    </button>
  )
}

export default Button
