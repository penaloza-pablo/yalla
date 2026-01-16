import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
import './index.css'
import App from './App.tsx'

const loadAmplifyOutputs = async () => {
  try {
    const response = await fetch('/amplify_outputs.json')
    if (response.ok) {
      return (await response.json()) as Record<string, unknown>
    }
  } catch {
    // No-op: fallback to empty config for non-Amplify builds.
  }
  return {}
}

const startApp = async () => {
  const outputs = await loadAmplifyOutputs()
  Amplify.configure(outputs)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Authenticator>
        <App />
      </Authenticator>
    </StrictMode>,
  )
}

void startApp()
