import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { EventList } from './EventList'
import { Event } from './Event'

createRoot(document.body).render(
    <StrictMode>
        <BrowserRouter>
            <App>
                <Routes>
                    <Route path='/' element={<EventList />} />
                    <Route path="/event/:eventName" element={<Event />} />
                </Routes>
            </App>
        </BrowserRouter>
    </StrictMode>,
)
