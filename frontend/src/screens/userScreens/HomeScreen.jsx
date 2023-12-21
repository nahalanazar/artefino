import Hero from '../../components/userComponents/Hero'
import CategoriesTab from '../../components/userComponents/CategoriesTab'
import Posts from '../../components/userComponents/Posts'
import UserProfile from '../../components/userComponents/UserProfile'
import {lazy, Suspense} from 'react'
// import ArtistsList from '../../components/userComponents/ArtistsList'
const ArtistsList = lazy(() => import('../../components/userComponents/ArtistsList'))

const HomeScreen = () => {
  return (
    <>
      <CategoriesTab />
      {/* <Hero /> */}
       <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <UserProfile />
          </div>

          <div className="col-md-6 col-12">
            <Posts  />
          </div>
 
          <div className="col-md-3 d-none d-md-block">
            <Suspense fallback={<div>Loading...</div>}>
              <ArtistsList />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeScreen