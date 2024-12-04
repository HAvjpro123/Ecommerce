import React from 'react'
import DashboardChart from '../components/DashboardChart'
import DashboardListProduct from '../components/DashboardListProduct'
import { Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'
import { House } from 'lucide-react';
const Dashboard = ({ token }) => {
  return (
    <div className=''>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/">
          <House size={15}></House>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/"
        >
          Bảng điều khiển
        </Link>
      </Breadcrumbs>
      <p className='text-2xl my-4 font-bold text-gray-500'>BẢNG ĐIỀU KHIỂN</p>
      <DashboardChart token={token} />
      <div className='mt-9 rounded-md border border-gray-300'>
        <div className='p-6 bg-white'>
          <DashboardListProduct></DashboardListProduct>
        </div>
      </div>

    </div>
  )
}

export default Dashboard 