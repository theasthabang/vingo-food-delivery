import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice.js'

function useGetItemsByCity() {
  const dispatch = useDispatch()
  const { currentCity } = useSelector((state) => state.user)

  useEffect(() => {
    // ✅ Don't fetch if city isn't known yet
    if (!currentCity) return

    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        )
        dispatch(setItemsInMyCity(result.data))
      } catch (error) {
        console.error("Failed to fetch items by city:", error)
      }
    }

    fetchItems()
  }, [currentCity])
}

export default useGetItemsByCity