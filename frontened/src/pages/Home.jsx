import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/userDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'

function Home() {
  const { userData } = useSelector(state => state.user)

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#f8f8f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  )
}

export default Home