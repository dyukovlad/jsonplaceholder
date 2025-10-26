import React from 'react'

type Props = {
  name?: string
}

const Hello = ({ name = 'Friend' }: Props): JSX.Element => {
  return (
    <div style={{ padding: 12 }}>
      <h2>Привет, {name}!</h2>
      <p>Компонент написан на TypeScript и готов к развитию.</p>
    </div>
  )
}

export { Hello }
