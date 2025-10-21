import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Layout from '../components/Layout'
import PrivateRoute from './PrivateRoute'
import Movements from '../pages/Movements'
import Items from '../pages/Items'
import Categories from '../pages/Categories'
import Persons from '../pages/Persons'
import Suppliers from '../pages/Suppliers'
import Users from '../pages/Users'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/movements" element={<Movements />} />
                        <Route path="/items" element={<Items />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/persons" element={<Persons />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
