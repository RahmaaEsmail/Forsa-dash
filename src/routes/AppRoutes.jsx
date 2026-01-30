import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routesData } from './routesData'
import DashLayout from '../layout/DashLayout/DashLayout'
import Loading from '../components/shared/Loading'
import Login from '../pages/Login/Login'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<DashLayout />}>
          {routesData?.map(route => <Route
            key={route.id}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>
                <route.component />
              </Suspense>
            }

          />)}
        </Route>
      </Route>

    </Routes>
  )
}
