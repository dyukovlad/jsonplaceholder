import { Hello } from './components/Hello'
import { PostsGroupedByUser } from './components/PostsGroupedByUser'
import { ErrorBoundary } from './components/ErrorBoundary'

const App = (): JSX.Element => {
  return (
    <div className="app-root">
      <header>
        <h1>Витая стартовая аппликация (Vite + React + TypeScript)</h1>
      </header>

      <main>
        <Hello name="Мир" />
        <ErrorBoundary>
          <PostsGroupedByUser />
        </ErrorBoundary>

        <section>
          <p>
            <code>Это минимальный шаблон</code>.
          </p>
        </section>
      </main>

      <footer>
        <small>© {new Date().getFullYear()}</small>
      </footer>
    </div>
  )
}

export default App
