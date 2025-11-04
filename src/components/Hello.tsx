type Props = {
  name?: string
}

const Hello = ({ name = 'Friend' }: Props): JSX.Element => {
  return (
    <section style={{ padding: 12 }} aria-labelledby="hello-heading" role="banner">
      <h2 id="hello-heading">Привет, {name}!</h2>
      <p>Компонент написан на TypeScript и готов к развитию.</p>
    </section>
  )
}

export { Hello }
