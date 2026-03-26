import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  useEffect(() => {
    // ✅ Guard — don't run if not logged in
    if (!userData) return

    // ✅ Guard — check geolocation support
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        dispatch(setLocation({ lat: latitude, lon: longitude }))

        // ✅ Try/catch around external API call
        try {
          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: 'json',
                apiKey,
              },
            }
          )

          const place = result?.data?.results?.[0]
          if (!place) return

          dispatch(setCurrentCity(place.city || place.county || ""))
          dispatch(setCurrentState(place.state || ""))
          dispatch(setCurrentAddress(place.address_line2 || place.address_line1 || ""))
          dispatch(setAddress(place.address_line2 || place.address_line1 || ""))

        } catch (error) {
          console.error("Reverse geocode failed:", error)
        }
      },
      // ✅ Error callback — handles denied/unavailable location
      (error) => {
        console.warn("Location access denied:", error.message)
      }
    )
  }, [userData]) // runs once when userData becomes available

}

export default useGetCity