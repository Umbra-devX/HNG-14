import { useTheme } from '../context/ThemeContext'
import './Sidebar.css'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__logo">
        <div className="sidebar__logo-bg">
          <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H20L28 13L20 26H0L8 13L0 0Z" fill="#7C5DFA"/>
            <path d="M8 0H20L28 13L20 26H8L16 13L8 0Z" fill="#9277FF"/>
          </svg>
        </div>
      </div>

      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill="#858BB2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" fill="#858BB2"/>
              <path d="M10 0a10 10 0 00-7.94 16.07A10 10 0 1010 0z" fill="#858BB2"/>
            </svg>
          )}
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <div className="sidebar__avatar" aria-label="User avatar">
          <img src="https://i.pravatar.cc/40" alt="User avatar" />
        </div>
      </div>
    </aside>
  )
}