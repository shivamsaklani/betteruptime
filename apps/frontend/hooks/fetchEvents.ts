import { useEffect } from "react"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setAlerts, setError, setLoading,  } from "@/lib/features/notifications/Events"

export const useFetchEvents = () => {
  const dispatch = useAppDispatch()
  const {data,error,success, loading} = useAppSelector((state) => state.Alerts) 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(setError(null)) 

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/getalerts`, {
          withCredentials: true,
        })

        dispatch(setAlerts(res.data.alerts)) 
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to fetch alerts"))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchEvents()
  }, [dispatch])

  return { data,error,success,loading } // return state for components
}
