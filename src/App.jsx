import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from './components/ui/sonner'

export default function App() {
  

	return (
		<div>
			<AppRoutes />
			<Toaster position="top-center"/>
		</div>
	)
}
