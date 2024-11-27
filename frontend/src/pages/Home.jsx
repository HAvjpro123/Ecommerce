import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import Carousel from '../components/Carousel'
import UserChat from './UserChat'
import FloatingButton from '../components/FloatingButton'

const Home = () => {
  return (
    <div>
      <Carousel />
      <LatestCollection />
      <Hero />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
      <UserChat></UserChat>
      <FloatingButton></FloatingButton>
    </div>
  )
}

export default Home