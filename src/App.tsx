import { Hello } from './components/Hello/Hello'
import { PostsGroupedByUser } from './components/PostsGroupedByUser/PostsGroupedByUser'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'

const App = (): JSX.Element => {
  return (
    <div className="app-root">
      <header role="banner">
        <h1>Витая стартовая аппликация (Vite + React + TypeScript)</h1>
      </header>

      <Hello name="Мир" />

      <ErrorBoundary>
        <PostsGroupedByUser />
      </ErrorBoundary>

      <aside role="complementary" aria-label="Информация о приложении">
        <p>
          <code>Это минимальный шаблон</code>.
        </p>
      </aside>

      <footer role="contentinfo">
        <small>© {new Date().getFullYear()}</small>
      </footer>
    </div>
  )
}

export default App
