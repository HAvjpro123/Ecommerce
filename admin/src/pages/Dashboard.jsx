import React from 'react'
import ListProduct from './ListProduct'
import DashboardChart from '../components/DashboardChart'
import DashboardListProduct from '../components/DashboardListProduct'

const Dashboard = ({ token }) => {
  return (
    <div>
      <DashboardChart token={token} />
      <div className='mt-9 border border-gray-300 rounded-sm'>
        <div className='p-6'>
          <DashboardListProduct></DashboardListProduct>
        </div>
         
      </div>
     




    </div>
  )
}

export default Dashboard 